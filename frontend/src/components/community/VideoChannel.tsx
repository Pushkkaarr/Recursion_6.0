'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Users, Pencil, Maximize, X, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import Whiteboard from './Whiteboard';
import { toast } from 'sonner';

interface VideoChannelProps {
  channelId: string;
  channelName: string;
  username: string;
  isGuest: boolean;
  userId?: string;
  showVideo: boolean;
}

interface RemoteUser {
  socketId: string;
  username: string;
  isGuest: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  stream?: MediaStream;
}

export default function VideoChannel({ channelId, channelName, username, isGuest, userId, showVideo }: VideoChannelProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(showVideo);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [peerConnections, setPeerConnections] = useState<Record<string, RTCPeerConnection>>({});
  const [activeUserView, setActiveUserView] = useState<string | null>(null);
  const [mediaDevicesSupported, setMediaDevicesSupported] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  
  // Maximum users to show per page
  const maxUsersPerPage = 4;
  
  // Connect to socket and set up WebRTC
  useEffect(() => {
    const checkMediaDevicesSupport = () => {
      // Check if we're in a secure context
      const isSecureContext = window.isSecureContext;
      
      // Check if mediaDevices API is available
      const hasMediaDevices = typeof navigator !== 'undefined' && 
                            navigator.mediaDevices !== undefined;
      
      return isSecureContext && hasMediaDevices;
    };

    const setupCall = async () => {
      try {
        const newSocket = io(`${process.env.NEXT_PUBLIC_WS_URL || 'http://192.168.1.223:5000'}`);
        
        newSocket.on('connect', async () => {
          console.log('Connected to socket');
          
          try {
            // Get ICE servers
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/rtc/ice-servers`);
            if (!response.ok) throw new Error('Failed to get ICE servers');
            
            const { iceServers } = await response.json();
            
            // Check if mediaDevices is supported
            if (!checkMediaDevicesSupport()) {
              setMediaDevicesSupported(false);
              throw new Error('MediaDevices API not supported in this browser or context');
            }
            
            // Set up local media stream
            const constraints = {
              audio: true,
              video: showVideo
            };
            
            try {
              const stream = await navigator.mediaDevices.getUserMedia(constraints);
              setLocalStream(stream);
              
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
              }
            } catch (mediaError) {
              console.error('Media access error:', mediaError);
              
              // Try only audio if video fails
              if (showVideo) {
                try {
                  const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                  setLocalStream(audioOnlyStream);
                  setVideoEnabled(false);
                  
                  toast.warning('Camera access denied or not available. Continuing with audio only.');
                } catch (audioError) {
                  console.error('Audio-only access error:', audioError);
                  toast.error('Microphone access denied. You will be in listen-only mode.');
                }
              }
            }
            
            // Join the call with user data
            newSocket.emit('joinCall', channelId, {
              username,
              isGuest,
              userId,
              audioEnabled: true,
              videoEnabled: showVideo && videoEnabled
            });
            
            setIsConnecting(false);
          } catch (err) {
            console.error('Error setting up media:', err);
            
            // More specific error handling
            if (err instanceof Error) {
              if (err.message === 'MediaDevices API not supported in this browser or context') {
                toast.error('Video/audio calling is not supported in this browser or context. This may be because you are not using HTTPS.', { 
                  duration: 6000 
                });
              } else if (err.message.includes('Permission denied') || err.name === 'NotAllowedError') {
                toast.error('Camera/microphone access denied. Please check permissions.');
              } else if (err.name === 'NotFoundError') {
                toast.error('No camera or microphone found. Please check your device.');
              } else {
                toast.error('Failed to access camera/microphone. Please check permissions.');
              }
            } else {
              toast.error('An unknown error occurred while setting up media.');
            }
            
            // Allow user to continue with limited functionality
            setIsConnecting(false);
            
            // Join the call without media
            newSocket.emit('joinCall', channelId, {
              username,
              isGuest,
              userId,
              audioEnabled: false,
              videoEnabled: false
            });
          }
        });
        
        // Handle new user joining
        newSocket.on('userJoined', (userData: any) => {
          console.log('User joined:', userData);
          toast.info(`${userData.username} joined the call`);
          
          // Create a new peer connection for this user
          if (localStream) {
            createPeerConnection(userData.socketId, localStream, newSocket);
          }
        });
        
        // Handle existing users in the room
        newSocket.on('existingUsers', (users: any[]) => {
          console.log('Existing users:', users);
          
          // Update remote users state with user information
          setRemoteUsers(users.map(user => ({
            socketId: user.socketId,
            username: user.username,
            isGuest: user.isGuest,
            audioEnabled: user.audioEnabled,
            videoEnabled: user.videoEnabled
          })));
          
          // Create peer connections for all existing users
          if (localStream) {
            users.forEach(user => {
              if (user.socketId !== newSocket.id) {
                createPeerConnection(user.socketId, localStream, newSocket);
              }
            });
          }
        });
        
        // Handle user media state changes
        newSocket.on('mediaStateChange', (socketId: string, state: any) => {
          setRemoteUsers(prev => 
            prev.map(user => 
              user.socketId === socketId 
                ? { ...user, ...state } 
                : user
            )
          );
        });
        
        // Handle WebRTC signaling
        newSocket.on('offer', async (offer: RTCSessionDescriptionInit, from: string) => {
          console.log('Received offer from:', from);
          
          if (!peerConnections[from] && localStream) {
            createPeerConnection(from, localStream, newSocket);
          }
          
          const pc = peerConnections[from];
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            newSocket.emit('answer', answer, from);
          }
        });
        
        newSocket.on('answer', (answer: RTCSessionDescriptionInit, from: string) => {
          console.log('Received answer from:', from);
          const pc = peerConnections[from];
          if (pc) {
            pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });
        
        newSocket.on('ice-candidate', (candidate: RTCIceCandidateInit, from: string) => {
          console.log('Received ICE candidate from:', from);
          const pc = peerConnections[from];
          if (pc) {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });
        
        // Handle user leaving
        newSocket.on('userLeft', (socketId: string) => {
          console.log('User left:', socketId);
          
          // Close and remove the peer connection
          if (peerConnections[socketId]) {
            peerConnections[socketId].close();
            const newConnections = { ...peerConnections };
            delete newConnections[socketId];
            setPeerConnections(newConnections);
          }
          
          // Remove the user from remoteUsers
          setRemoteUsers(prev => prev.filter(user => user.socketId !== socketId));
          
          // If showing the focused view of a user who left, reset to grid view
          if (activeUserView === socketId) {
            setActiveUserView(null);
          }
          
          toast.info('A user left the call');
        });
        
        // Handle whiteboard data
        newSocket.on('whiteboardData', (data: any) => {
          // Handle whiteboard data from other users
          console.log('Received whiteboard data:', data);
        });
        
        // Handle disconnection
        newSocket.on('disconnect', () => {
          console.log('Disconnected from socket');
        });
        
        setSocket(newSocket);
      } catch (error) {
        console.error('Socket setup error:', error);
        setIsConnecting(false);
        toast.error('Failed to connect to the call. Please try again later.');
      }
    };

    setupCall();
    
    // Cleanup on unmount
    return () => {
      // Close all peer connections
      Object.values(peerConnections).forEach(pc => pc.close());
      
      // Stop local stream tracks
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      // Stop screen sharing stream
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      
      // Disconnect socket
      if (socket) {
        socket.disconnect();
      }
    };
  }, [channelId, username, isGuest, userId, showVideo]);
  
  // Create a peer connection for a specific user
  const createPeerConnection = async (socketId: string, stream: MediaStream, socket: Socket) => {
    try {
      // Get ICE servers
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/rtc/ice-servers`);
      if (!response.ok) throw new Error('Failed to get ICE servers');
      
      const { iceServers } = await response.json();
      
      // Check if RTCPeerConnection is supported
      if (typeof RTCPeerConnection === 'undefined') {
        throw new Error('WebRTC is not supported in this browser');
      }
      
      const pc = new RTCPeerConnection({ iceServers });
      
      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
      
      // Add screen sharing track if available
      if (screenStream) {
        screenStream.getTracks().forEach(track => {
          pc.addTrack(track, screenStream);
        });
      }
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate, socketId);
        }
      };
      
      // Handle remote stream
      pc.ontrack = (event) => {
        console.log('Received remote track:', event);
        
        if (event.streams && event.streams[0]) {
          // Create or update remote user with stream
          setRemoteUsers(prev => {
            const existingUserIndex = prev.findIndex(user => user.socketId === socketId);
            
            if (existingUserIndex >= 0) {
              const updatedUsers = [...prev];
              updatedUsers[existingUserIndex] = {
                ...updatedUsers[existingUserIndex],
                stream: event.streams[0]
              };
              return updatedUsers;
            } else {
              // This should not happen often as users are normally added via userJoined event
              return [...prev, {
                socketId,
                username: `User-${socketId.substring(0, 5)}`,
                isGuest: true,
                audioEnabled: true,
                videoEnabled: true,
                stream: event.streams[0]
              }];
            }
          });
        }
      };
      
      // Create and send offer if we are the initiator
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', offer, socketId);
      
      // Add to peer connections state
      setPeerConnections(prev => ({
        ...prev,
        [socketId]: pc
      }));
      
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      toast.error('Failed to connect to peer');
      return null;
    }
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const enabled = !audioEnabled;
        audioTracks[0].enabled = enabled;
        setAudioEnabled(enabled);
        
        // Notify other users about the change
        if (socket) {
          socket.emit('mediaStateChange', channelId, { audioEnabled: enabled });
        }
      }
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const enabled = !videoEnabled;
        videoTracks[0].enabled = enabled;
        setVideoEnabled(enabled);
        
        // Notify other users about the change
        if (socket) {
          socket.emit('mediaStateChange', channelId, { videoEnabled: enabled });
        }
      }
    }
  };
  
  // Toggle screen sharing
  const toggleScreenSharing = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
        }
        setIsScreenSharing(false);
      } else {
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          throw new Error('Screen sharing is not supported in this browser or context');
        }
        
        // Start screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }
        
        // Add screen track to all peer connections
        Object.values(peerConnections).forEach(pc => {
          stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
          });
        });
        
        // Listen for when the user stops sharing
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
        
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Screen sharing is not supported in this browser or context') {
          toast.error('Screen sharing is not supported in this browser. Please use a modern browser with HTTPS.');
        } else if (error.name === 'NotAllowedError') {
          toast.error('Permission to share screen was denied.');
        } else {
          toast.error('Failed to share screen. Please try again.');
        }
      } else {
        toast.error('Failed to share screen. Please try again.');
      }
    }
  };
  
  // Handle leaving the call
  const leaveCall = () => {
    if (socket) {
      socket.disconnect();
    }
    
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    
    // Redirect to text channel
    toast.info('You left the call');
    // Add redirect or navigation logic here
  };
  
  // Toggle focus on a specific user
  const toggleFocusUser = (socketId: string | null) => {
    setActiveUserView(activeUserView === socketId ? null : socketId);
  };

  // Calculate pagination details
  const allUsers = [{ isLocal: true }, ...remoteUsers.map(user => ({ isLocal: false, user }))];
  const totalPages = Math.ceil(allUsers.length / maxUsersPerPage);
  
  // Get current page users
  const getCurrentPageUsers = () => {
    const startIndex = currentPage * maxUsersPerPage;
    return allUsers.slice(startIndex, startIndex + maxUsersPerPage);
  };
  
  const visibleUsers = getCurrentPageUsers();
  
  // Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Calculate grid layout
  const getGridClass = () => {
    if (activeUserView !== null) {
      return 'grid-cols-1';
    }
    
    switch (visibleUsers.length) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2 grid-rows-2';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      default:
        return 'grid-cols-2 grid-rows-2';
    }
  };
  
  // Function to render user video
  const renderVideoTile = (isLocal: boolean, user?: RemoteUser) => {
    const isFocused = isLocal ? activeUserView === 'local' : activeUserView === user?.socketId;
    const userVideoEnabled = isLocal ? videoEnabled : (user?.videoEnabled ?? false);
    const userAudioEnabled = isLocal ? audioEnabled : (user?.audioEnabled ?? false);
    const displayName = isLocal ? username : (user?.username ?? 'Unknown');
    
    return (
      <div 
        className={`bg-[#2A2A30] rounded-lg overflow-hidden relative shadow-md transition-all h-full
          ${isFocused ? 'col-span-full row-span-full z-10' : ''}`}
      >
        {/* Video element */}
        {isLocal ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!userVideoEnabled ? 'hidden' : ''}`}
          />
        ) : user?.stream ? (
          <video
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${!userVideoEnabled ? 'hidden' : ''}`}
            ref={el => {
              if (el && user.stream) {
                el.srcObject = user.stream;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}
        
        {/* Avatar fallback when video is disabled */}
        {!userVideoEnabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-2xl font-medium">
              {displayName?.charAt(0).toUpperCase() || '?'}
            </div>
          </div>
        )}
        
        {/* Username and audio status */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-sm flex items-center">
          {!userAudioEnabled && <MicOff size={14} className="mr-1 text-red-400" />}
          {isLocal ? 'You' : displayName}
        </div>
        
        {/* Focus/expand button */}
        <button 
          className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-black/70 opacity-0 hover:opacity-100 transition-opacity"
          onClick={() => {
            if (isLocal) {
              toggleFocusUser('local');
            } else if (user) {
              toggleFocusUser(user.socketId);
            }
          }}
        >
          {isFocused ? <X size={16} /> : <Maximize size={16} />}
        </button>
      </div>
    );
  };

  // Render instructions for enabling secure context
  const renderMediaNotSupported = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <div className="bg-[#2A2A30] p-6 rounded-lg max-w-md">
          <VideoOff size={40} className="mx-auto text-[#ED4245] mb-4" />
          <h3 className="text-xl font-medium mb-2">Camera/Microphone Access Not Available</h3>
          <p className="text-[#B5BAC1] mb-4">
            Your browser can't access your camera or microphone. This is usually because:
          </p>
          <ul className="text-left text-[#B5BAC1] mb-4 space-y-2 list-disc pl-5">
            <li>You're not using a secure connection (HTTPS)</li>
            <li>You're using an older browser that doesn't support WebRTC</li>
            <li>Camera/microphone permissions are blocked</li>
          </ul>
          <div className="space-y-3">
            <p className="text-[#B5BAC1] font-medium">Try these solutions:</p>
            <div className="bg-[#36363C] p-3 rounded text-left">
              <p className="text-sm text-[#B5BAC1] mb-1 font-medium">If you're running locally:</p>
              <p className="text-xs text-[#B5BAC1]">Use <code className="bg-[#202225] px-1 py-0.5 rounded">localhost</code> instead of an IP address</p>
            </div>
            <div className="bg-[#36363C] p-3 rounded text-left">
              <p className="text-sm text-[#B5BAC1] mb-1 font-medium">For deployment:</p>
              <p className="text-xs text-[#B5BAC1]">Ensure your site uses HTTPS</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render function for the connected/non-connected state
  const renderContent = () => {
    if (isConnecting) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader className="w-8 h-8 text-[#5865F2] animate-spin mb-2" />
          <p className="text-[#B5BAC1]">Connecting to call...</p>
        </div>
      );
    } else if (!mediaDevicesSupported) {
      return renderMediaNotSupported();
    } else if (showWhiteboard) {
      return (
        <div className="h-full flex flex-col relative">
          <button
            onClick={() => setShowWhiteboard(false)}
            className="absolute top-2 right-2 bg-[#4E5058] rounded-full p-1.5 shadow-md hover:bg-[#6D6F78] z-10"
          >
            <X size={16} />
          </button>
          <Whiteboard channelId={channelId} socket={socket} />
        </div>
      );
    } else {
      return (
        <div className="h-full flex flex-col">
          {/* Screen Share (if active) */}
          {isScreenSharing && screenStream && (
            <div className="relative bg-black rounded-lg overflow-hidden shadow-md mb-4 h-2/5">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 right-2">
                <button 
                  className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-white hover:bg-black/70 transition-colors"
                  onClick={() => setIsScreenSharing(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-sm">
                Screen Share - {username}
              </div>
            </div>
          )}
          
          {/* Pagination controls - only show if needed */}
          {totalPages > 1 && (
            <div className="flex justify-center mb-3 items-center space-x-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`rounded-full p-1.5 transition-colors ${
                  currentPage === 0 
                    ? 'bg-[#4E5058]/30 text-[#B5BAC1]/50 cursor-not-allowed' 
                    : 'bg-[#4E5058] text-white hover:bg-[#6D6F78]'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-[#B5BAC1] text-sm">
                {currentPage + 1} / {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className={`rounded-full p-1.5 transition-colors ${
                  currentPage === totalPages - 1 
                    ? 'bg-[#4E5058]/30 text-[#B5BAC1]/50 cursor-not-allowed' 
                    : 'bg-[#4E5058] text-white hover:bg-[#6D6F78]'
                }`}
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          
          {/* Video Grid */}
          <div className={`grid ${getGridClass()} gap-3 h-full`}>
            {visibleUsers.map((item, index) => (
              <div key={item.isLocal ? 'local-user' : item.user?.socketId || `remote-${index}`} className="h-full">
                {renderVideoTile(item.isLocal, item.user ?? undefined)}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-[#313338] text-white">
      {/* Channel Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#222327] bg-[#2B2D31]">
        <div className="flex items-center">
          {showVideo ? (
            <Video size={18} className="text-[#B5BAC1] mr-2" />
          ) : (
            <Mic size={18} className="text-[#B5BAC1] mr-2" />
          )}
          <h2 className="font-medium text-[#F2F3F5]">{channelName}</h2>
        </div>
        <div className="flex items-center">
          <div className="flex items-center text-sm text-[#B5BAC1] mr-3">
            <Users size={16} className="mr-1.5" />
            <span>{remoteUsers.length + 1}</span>
          </div>
          <button 
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`p-1.5 rounded-md ${
              showWhiteboard ? 'bg-[#5865F2]' : 'hover:bg-[#393C41] text-[#B5BAC1]'
            }`}
          >
            <Pencil size={16} />
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-hidden relative bg-[#313338]">
        {renderContent()}
      </div>
      
      {/* Call Controls */}
      <div className="h-16 bg-[#292B2F] border-t border-[#222327] flex items-center justify-center">
        <div className="flex space-x-3">
          <button
            onClick={toggleAudio}
            disabled={!localStream || !mediaDevicesSupported}
            className={`p-3 rounded-full transition-colors ${
              !localStream || !mediaDevicesSupported ? 'bg-[#4E5058]/30 text-[#B5BAC1]/50 cursor-not-allowed' :
              audioEnabled 
                ? 'bg-[#4E5058] hover:bg-[#6D6F78] text-white' 
                : 'bg-[#ED4245] hover:bg-[#ED4245]/80 text-white'
            }`}
            title={audioEnabled ? "Mute" : "Unmute"}
          >
            {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          
          {showVideo && (
            <button
              onClick={toggleVideo}
              disabled={!localStream}
              className={`p-3 rounded-full transition-colors ${
                !localStream ? 'bg-[#4E5058]/30 text-[#B5BAC1]/50 cursor-not-allowed' :
                videoEnabled 
                  ? 'bg-[#4E5058] hover:bg-[#6D6F78] text-white' 
                  : 'bg-[#ED4245] hover:bg-[#ED4245]/80 text-white'
              }`}
              title={videoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
          )}
          
          <button
            onClick={toggleScreenSharing}
            disabled={!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia}
            className={`p-3 rounded-full transition-colors ${
              !navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia ? 
                'bg-[#4E5058]/30 text-[#B5BAC1]/50 cursor-not-allowed' :
              isScreenSharing
                ? 'bg-[#5865F2] hover:bg-[#5865F2]/80 text-white'
                : 'bg-[#4E5058] hover:bg-[#6D6F78] text-white'
            }`}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            <Monitor size={20} />
          </button>
          
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            className={`p-3 rounded-full transition-colors ${
              showWhiteboard
                ? 'bg-[#5865F2] hover:bg-[#5865F2]/80 text-white'
                : 'bg-[#4E5058] hover:bg-[#6D6F78] text-white'
            }`}
            title={showWhiteboard ? "Hide whiteboard" : "Show whiteboard"}
          >
            <Pencil size={20} />
          </button>
          
          <button
            onClick={leaveCall}
            className="p-3 rounded-full bg-[#ED4245] hover:bg-[#ED4245]/80 text-white transition-colors"
            title="Leave call"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}