'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Users, Pencil, Maximize, X, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import Whiteboard from './Whiteboard';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  
  // Maximum users to show per page
  const maxUsersPerPage = 4;
  
  // Connect to socket and set up WebRTC
  useEffect(() => {
    console.log('Connecting to WebSocket server...');
    const newSocket = io(`${process.env.NEXT_PUBLIC_WS_URL || 'https://192.168.1.223:5001'}`);
    
    // Socket event handlers
    newSocket.on('connect', async () => {
      console.log('Connected to socket server with ID:', newSocket.id);
      setConnectionError(null);
      
      try {
        // Check if MediaDevices API is supported
        if (!navigator.mediaDevices) {
          throw new Error('MediaDevices API not supported in this browser or context');
        }

        // Get ICE servers
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://192.168.1.223:5001'}/api/rtc/ice-servers`);
        if (!response.ok) throw new Error('Failed to get ICE servers');
        
        const { iceServers } = await response.json();
        console.log('ICE servers:', iceServers);
        
        // Set up local media stream
        const constraints = {
          audio: true,
          video: showVideo
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Local stream obtained:', stream.id);
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Join the channel with user data
        console.log('Joining channel:', channelId);
        newSocket.emit('join-channel', {
          channelId,
          userId,
          username
        });
        
        setIsConnecting(false);
      } catch (err) {
        console.error('Error setting up media:', err);
        
        // Specific error handling
        if (err instanceof Error) {
          if (err.message === 'MediaDevices API not supported in this browser or context') {
            toast.error('Video/audio calling is not supported in this browser or context. Please use a modern browser with HTTPS.');
            setConnectionError('Media API not supported');
          } else if (err.message.includes('Permission denied') || err.name === 'NotAllowedError') {
            toast.error('Camera/microphone access denied. Please check permissions.');
            setConnectionError('Permission denied');
          } else if (err.name === 'NotFoundError') {
            toast.error('No camera or microphone found. Please check your device.');
            setConnectionError('No camera/mic found');
          } else {
            toast.error('Failed to access camera/microphone. Please check permissions.');
            setConnectionError('Media access failed');
          }
        } else {
          toast.error('An unknown error occurred while setting up media.');
          setConnectionError('Unknown error');
        }
        
        // Allow user to continue with limited functionality
        setIsConnecting(false);
        
        // Join the channel without media
        console.log('Joining channel without media');
        newSocket.emit('join-channel', {
          channelId,
          userId,
          username
        });
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Failed to connect to the server. Please check your internet connection.');
      setConnectionError('Server connection failed');
      setIsConnecting(false);
    });
    
    // Handle new user joining
    newSocket.on('user-joined', (userData) => {
      console.log('User joined event received:', userData);
      toast.info(`${userData.username} joined the call`);
      
      // Create a new peer connection for this user
      if (localStream) {
        console.log('Creating peer connection for new user:', userData.socketId);
        createPeerConnection(userData.socketId, localStream, newSocket);
      }
      
      // Add the user to our remote users list if not already there
      setRemoteUsers(prev => {
        if (!prev.some(user => user.socketId === userData.socketId)) {
          return [...prev, {
            socketId: userData.socketId,
            username: userData.username,
            isGuest: !!userData.isGuest,
            audioEnabled: true,
            videoEnabled: showVideo
          }];
        }
        return prev;
      });
    });
    
    // Handle existing channel participants
    newSocket.on('channel-participants', (participants) => {
      console.log('Channel participants received:', participants);
      
      const currentUsersMap = Object.entries(participants).map(([socketId, data]: [string, any]) => ({
        socketId,
        username: data.username,
        isGuest: !!data.isGuest,
        audioEnabled: true,
        videoEnabled: showVideo,
      })).filter((user) => user.socketId !== newSocket.id);
      
      // Update remote users state with user information
      setRemoteUsers(currentUsersMap);
      
      // Create peer connections for all existing users
      if (localStream) {
        currentUsersMap.forEach(user => {
          console.log('Creating peer connection for existing user:', user.socketId);
          createPeerConnection(user.socketId, localStream, newSocket);
        });
      }
    });
    
    // Handle WebRTC signaling
    newSocket.on('rtc-offer', async (data) => {
      console.log('Received offer from:', data.from);
      
      // Create peer connection if it doesn't exist
      if (!peerConnections[data.from] && localStream) {
        console.log('Creating peer connection in response to offer');
        await createPeerConnection(data.from, localStream, newSocket);
      }
      
      const pc = peerConnections[data.from];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          console.log('Remote description set from offer');
          
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          console.log('Local description set from answer');
          
          newSocket.emit('rtc-answer', {
            channelId: data.channelId,
            to: data.from,
            from: newSocket.id,
            answer
          });
          console.log('Answer sent to:', data.from);
        } catch (err) {
          console.error('Error handling offer:', err);
        }
      }
    });
    
    newSocket.on('rtc-answer', (data) => {
      console.log('Received answer from:', data.from);
      const pc = peerConnections[data.from];
      if (pc) {
        pc.setRemoteDescription(new RTCSessionDescription(data.answer))
          .then(() => console.log('Remote description set successfully from answer'))
          .catch(err => console.error('Error setting remote description from answer:', err));
      }
    });
    
    newSocket.on('ice-candidate', (data) => {
      console.log('Received ICE candidate for:', data.to);
      const pc = peerConnections[data.to];
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate))
          .then(() => console.log('Added ICE candidate successfully'))
          .catch(err => console.error('Error adding ICE candidate:', err));
      }
    });
    
    // Handle user leaving
    newSocket.on('user-left', (data) => {
      console.log('User left:', data.socketId);
      
      // Close and remove the peer connection
      if (peerConnections[data.socketId]) {
        peerConnections[data.socketId].close();
        const newConnections = { ...peerConnections };
        delete newConnections[data.socketId];
        setPeerConnections(newConnections);
      }
      
      // Remove the user from remoteUsers
      setRemoteUsers(prev => prev.filter(user => user.socketId !== data.socketId));
      
      // If showing the focused view of a user who left, reset to grid view
      if (activeUserView === data.socketId) {
        setActiveUserView(null);
      }
      
      toast.info(`${data.username} left the call`);
    });
    
    // Handle whiteboard events
    newSocket.on('whiteboard-updated', (data) => {
      console.log('Received whiteboard data:', data);
      // The data will be handled directly by the Whiteboard component
    });
    
    // Handle disconnection
    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket');
      toast.error('Disconnected from the call server');
      setConnectionError('Disconnected');
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      console.log('Cleaning up VideoChannel component');
      // Close all peer connections
      Object.values(peerConnections).forEach(pc => {
        console.log('Closing peer connection');
        pc.close();
      });
      
      // Stop local stream tracks
      if (localStream) {
        console.log('Stopping local stream tracks');
        localStream.getTracks().forEach(track => track.stop());
      }
      
      // Stop screen sharing stream
      if (screenStream) {
        console.log('Stopping screen sharing tracks');
        screenStream.getTracks().forEach(track => track.stop());
      }
      
      // Leave channel before disconnecting
      console.log('Leaving channel:', channelId);
      newSocket.emit('leave-channel', { channelId });
      
      // Disconnect socket
      console.log('Disconnecting socket');
      newSocket.disconnect();
    };
  }, [channelId, username, isGuest, userId, showVideo]);
  
  // Create a peer connection for a specific user
  const createPeerConnection = async (socketId: string, stream: MediaStream, socket: Socket) => {
    try {
      // Skip if we already have a connection for this user
      if (peerConnections[socketId]) {
        console.log('Peer connection already exists for:', socketId);
        return peerConnections[socketId];
      }
      
      // Get ICE servers
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://192.168.1.223:5001'}/api/rtc/ice-servers`);
      if (!response.ok) throw new Error('Failed to get ICE servers');
      
      const { iceServers } = await response.json();
      
      // Check if RTCPeerConnection is supported
      if (typeof RTCPeerConnection === 'undefined') {
        throw new Error('WebRTC is not supported in this browser');
      }
      
      const pc = new RTCPeerConnection({ iceServers });
      console.log('Created peer connection for:', socketId);

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer connection`);
        pc.addTrack(track, stream);
      });
      
      // Add screen sharing track if available
      if (screenStream) {
        screenStream.getTracks().forEach(track => {
          console.log(`Adding screen ${track.kind} track to peer connection`);
          pc.addTrack(track, screenStream);
        });
      }
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate to:', socketId);
          socket.emit('ice-candidate', {
            channelId,
            to: socketId,
            candidate: event.candidate
          });
        }
      };
      
      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log(`Connection state for ${socketId}: ${pc.connectionState}`);
        
        if (pc.connectionState === 'connected') {
          console.log(`Connection successfully established with ${socketId}`);
        } else if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          console.warn(`Connection failed or disconnected with ${socketId}`);
          // Try to reconnect or clean up
          if (pc.connectionState === 'failed') {
            // Attempt to recreate the connection
            setTimeout(() => {
              if (peerConnections[socketId] === pc && localStream) {
                console.log('Attempting to recreate failed connection');
                pc.close();
                // Remove the connection so it will be recreated
                setPeerConnections(prev => {
                  const newConnections = { ...prev };
                  delete newConnections[socketId];
                  return newConnections;
                });
                createPeerConnection(socketId, localStream, socket);
              }
            }, 2000);
          }
        }
      };
      
      // Handle ice connection state changes
      pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state for ${socketId}: ${pc.iceConnectionState}`);
      };
      
      // Handle remote stream
      pc.ontrack = (event) => {
        console.log('Received remote track from:', socketId, event.streams);
        
        if (event.streams && event.streams[0]) {
          const remoteStream = event.streams[0];
          console.log('Remote stream ID:', remoteStream.id);
          
          // Create or update remote user with stream
          setRemoteUsers(prev => {
            const existingUserIndex = prev.findIndex(user => user.socketId === socketId);
            
            if (existingUserIndex >= 0) {
              console.log('Updating existing user with new stream');
              const updatedUsers = [...prev];
              updatedUsers[existingUserIndex] = {
                ...updatedUsers[existingUserIndex],
                stream: remoteStream
              };
              return updatedUsers;
            } else {
              console.log('Adding new remote user with stream');
              // If we get a track but don't have the user in our state yet
              return [...prev, {
                socketId,
                username: `User-${socketId.substring(0, 5)}`,
                isGuest: true,
                audioEnabled: true,
                videoEnabled: true,
                stream: remoteStream
              }];
            }
          });
        }
      };
      
      // Create and send offer if we are the initiator
      console.log('Creating offer to send to:', socketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log('Local description set from offer');
      
      socket.emit('rtc-offer', {
        channelId,
        to: socketId,
        from: socket.id,
        offer
      });
      console.log('Offer sent to:', socketId);
      
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
        
        // Notify other users
        if (socket) {
          socket.emit('stop-screen-share', { channelId });
        }
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
          
          // Notify other users
          if (socket) {
            socket.emit('stop-screen-share', { channelId });
          }
        };
        
        setIsScreenSharing(true);
        
        // Notify other users
        if (socket) {
          socket.emit('start-screen-share', { channelId });
        }
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
    // Leave channel
    if (socket) {
      socket.emit('leave-channel', { channelId });
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

  // Toggle whiteboard visibility and sync it with others
  const toggleWhiteboard = () => {
    const newVisibility = !showWhiteboard;
    setShowWhiteboard(newVisibility);
    
    // Broadcast the whiteboard visibility state to all participants
    if (socket) {
      socket.emit('whiteboard-update', { 
        channelId, 
        data: { type: 'visibility', visible: newVisibility } 
      });
    }
  };

  // Calculate pagination details
  const allUsers = [
    { isLocal: true, user: undefined }, 
    ...remoteUsers.map(user => ({ isLocal: false, user }))
  ];
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
    
    const visibleCount = visibleUsers.length;
    switch (visibleCount) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
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
    const hasStream = isLocal ? !!localStream : !!user?.stream;
    
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
            ref={(el) => {
              if (user && el) {
                remoteVideoRefs.current[user.socketId] = el;
                
                // Set srcObject only if it hasn't already been set
                if (el.srcObject !== user.stream) {
                  console.log(`Setting srcObject for remote user ${user.socketId}`);
                  el.srcObject = user.stream;
                  el.play().catch(err => console.error('Error playing video:', err));
                }
              }
            }}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${!userVideoEnabled ? 'hidden' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-[#B5BAC1] ml-2">Connecting...</p>
          </div>
        )}
        
        {/* Avatar fallback when video is disabled or no stream */}
        {(!userVideoEnabled || !hasStream) && (
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
  
  // Render function for the connected/non-connected state
  const renderContent = () => {
    if (isConnecting) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader className="w-8 h-8 text-[#5865F2] animate-spin mb-2" />
          <p className="text-[#B5BAC1]">Connecting to call...</p>
        </div>
      );
    } else if (connectionError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Alert variant="destructive" className="bg-[#2A2A30] border-[#ED4245]/50 max-w-md">
            <VideoOff className="h-6 w-6 text-[#ED4245]" />
            <AlertTitle className="text-white mt-1">Connection Error</AlertTitle>
            <AlertDescription className="text-[#B5BAC1]">
              {connectionError === 'Media API not supported' && (
                "Your browser doesn't support video/audio calls or you're not using a secure connection (HTTPS)."
              )}
              {connectionError === 'Permission denied' && (
                "Camera/microphone access was denied. Please check your browser permissions."
              )}
              {connectionError === 'No camera/mic found' && (
                "No camera or microphone was detected on your device."
              )}
              {connectionError === 'Media access failed' && (
                "Failed to access your camera/microphone. Please check your permissions."
              )}
              {connectionError === 'Server connection failed' && (
                "Failed to connect to the call server. Please check your internet connection."
              )}
              {connectionError === 'Disconnected' && (
                "You were disconnected from the call. Please try rejoining."
              )}
              {connectionError === 'Unknown error' && (
                "An unknown error occurred. Please try refreshing the page."
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    } else if (!navigator.mediaDevices && !localStream) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-[#2A2A30] p-6 rounded-lg max-w-md">
            <VideoOff size={40} className="mx-auto text-[#ED4245] mb-4" />
            <h3 className="text-xl font-medium mb-2">Media Access Not Available</h3>
            <p className="text-[#B5BAC1] mb-4">
              Your browser doesn't support video/audio calls or you're not using a secure connection (HTTPS).
            </p>
            <p className="text-[#B5BAC1]">
              Try using a modern browser like Chrome, Firefox, or Safari with a secure connection.
            </p>
          </div>
        </div>
      );
    } else if (showWhiteboard) {
      return (
        <div className="h-full flex flex-col relative">
          <button
            onClick={toggleWhiteboard}
            className="absolute top-2 right-2 bg-[#4E5058] rounded-full p-1.5 shadow-md hover:bg-[#6D6F78] z-10"
          >
            <X size={16} />
          </button>
          <Whiteboard channelId={channelId} socket={socket} syncedMode={true} />
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
                  onClick={() => toggleScreenSharing()}
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
          
          {/* Debug information */}
          <div className="text-xs text-[#B5BAC1] mb-2">
            Connected users: {remoteUsers.length + 1} | Remote videos: {Object.keys(remoteVideoRefs.current).length}
          </div>
          
          {/* Video Grid */}
          <div 
            className={`grid ${getGridClass()} gap-3 flex-1`}
            style={{ minHeight: '300px' }}
          >
            {visibleUsers.map((item, index) => (
              <div 
                key={item.isLocal ? 'local-user' : item.user?.socketId || `remote-${index}`} 
                className="h-full min-h-[200px]"
              >
                {renderVideoTile(item.isLocal, item.isLocal ? undefined : item.user)}
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
            onClick={toggleWhiteboard}
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
            disabled={!localStream}
            className={`p-3 rounded-full transition-colors ${
              !localStream ? 'bg-[#4E5058]/30 text-[#B5BAC1]/50 cursor-not-allowed' :
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
            onClick={toggleWhiteboard}
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