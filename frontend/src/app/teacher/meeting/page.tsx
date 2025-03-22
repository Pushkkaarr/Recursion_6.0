'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MeetingPage() {
  const searchParams = useSearchParams();
  const isInitiator = searchParams.get('initiator') === 'true';
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  const [offer, setOffer] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [iceCandidates, setIceCandidates] = useState<string[]>([]);
  const [remoteIceCandidates, setRemoteIceCandidates] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Initialize WebRTC
  useEffect(() => {
    // Create peer connection with STUN server
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });
    setPeerConnection(pc);

    // Get local media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        
        // Auto create offer if initiator
        if (isInitiator) {
          setTimeout(() => {
            createOffer();
          }, 1000);
        }
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
        setConnectionStatus('Error: ' + err.message);
      });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        setIceCandidates(prev => [...prev, JSON.stringify(event.candidate)]);
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      setConnectionStatus(`Connection: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return () => {
      // Clean up
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      pc.close();
    };
  }, [isInitiator]);

  // Create an offer
  const createOffer = async () => {
    if (!peerConnection) return;
    try {
      setConnectionStatus('Creating offer...');
      const offerDesc = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offerDesc);
      setOffer(JSON.stringify(offerDesc));
      setConnectionStatus('Offer created. Share it with the other user.');
    } catch (error) {
      console.error('Error creating offer:', error);
      setConnectionStatus('Error creating offer');
    }
  };

  // Create an answer
  const createAnswer = async () => {
    if (!peerConnection || !offer) return;
    try {
      setConnectionStatus('Creating answer...');
      const offerDesc = JSON.parse(offer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDesc));
      const answerDesc = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answerDesc);
      setAnswer(JSON.stringify(answerDesc));
      setConnectionStatus('Answer created. Share it back with the initiator.');
    } catch (error) {
      console.error('Error creating answer:', error);
      setConnectionStatus('Error: Invalid offer format');
    }
  };

  // Add remote answer
  const addAnswer = async () => {
    if (!peerConnection || !answer) return;
    try {
      setConnectionStatus('Adding answer...');
      const answerDesc = JSON.parse(answer);
      if (peerConnection.currentRemoteDescription) {
        setConnectionStatus('Remote description already set');
        return;
      }
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answerDesc));
      setConnectionStatus('Answer added. Establishing connection...');
    } catch (error) {
      console.error('Error adding answer:', error);
      setConnectionStatus('Error: Invalid answer format');
    }
  };

  // Add ICE candidates
  const addIceCandidates = () => {
    if (!peerConnection || !remoteIceCandidates) return;
    try {
      setConnectionStatus('Adding ICE candidates...');
      const candidatesArray = JSON.parse(remoteIceCandidates);
      
      if (Array.isArray(candidatesArray)) {
        candidatesArray.forEach(candidate => {
          peerConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
        });
      } else {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidatesArray));
      }
      setConnectionStatus('ICE candidates added');
    } catch (error) {
      console.error('Error adding ICE candidates:', error);
      setConnectionStatus('Error: Invalid ICE candidate format');
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Video Meeting</h1>
      <div className="mb-2 text-sm font-medium">{connectionStatus}</div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-2">Your Video</h2>
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline
            className="w-full h-48 md:h-64 bg-gray-100 border rounded-lg object-cover" 
          />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-2">Remote Video</h2>
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline
            className="w-full h-48 md:h-64 bg-gray-100 border rounded-lg object-cover" 
          />
        </div>
      </div>

      {!isConnected && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          {isInitiator ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button 
                  onClick={createOffer} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  1. Create Offer
                </button>
                {offer && (
                  <button 
                    onClick={() => copyToClipboard(offer)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Copy
                  </button>
                )}
              </div>
              <textarea
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Your offer will appear here. Share it with the other person."
                className="w-full h-24 p-2 border rounded text-sm font-mono"
                readOnly={!!offer}
              />

              <h3 className="font-medium mt-4">3. Paste Answer from Other Person</h3>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Paste the answer you received here"
                className="w-full h-24 p-2 border rounded text-sm font-mono"
              />
              <button 
                onClick={addAnswer} 
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
              >
                4. Add Answer
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-medium">1. Paste Offer from Initiator</h3>
              <textarea
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Paste the offer you received here"
                className="w-full h-24 p-2 border rounded text-sm font-mono"
              />
              
              <div className="flex gap-2">
                <button 
                  onClick={createAnswer} 
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  2. Create Answer
                </button>
                {answer && (
                  <button 
                    onClick={() => copyToClipboard(answer)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Copy
                  </button>
                )}
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer will appear here. Share it with the initiator."
                className="w-full h-24 p-2 border rounded text-sm font-mono"
                readOnly={!!answer}
              />
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium">Exchange ICE Candidates</h3>
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <h4 className="text-sm font-medium">Your ICE Candidates</h4>
                  {iceCandidates.length > 0 && (
                    <button 
                      onClick={() => copyToClipboard(JSON.stringify(iceCandidates))}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  )}
                </div>
                <textarea
                  value={JSON.stringify(iceCandidates, null, 2)}
                  className="w-full h-24 p-2 border rounded text-xs font-mono bg-gray-50"
                  readOnly
                />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-medium">Remote ICE Candidates</h4>
                <textarea
                  value={remoteIceCandidates}
                  onChange={(e) => setRemoteIceCandidates(e.target.value)}
                  placeholder="Paste the other person's ICE candidates here"
                  className="w-full h-24 p-2 border rounded text-xs font-mono"
                />
                <button 
                  onClick={addIceCandidates} 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Add ICE Candidates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>One person should join as the initiator by adding <code>?initiator=true</code> to the URL.</li>
          <li>The initiator clicks "Create Offer" and shares it with the other person.</li>
          <li>The other person pastes the offer and clicks "Create Answer".</li>
          <li>They share the answer back to the initiator, who adds it.</li>
          <li>Both users should share and add each other's ICE candidates.</li>
          <li>Once connected, you should see each other's video and audio.</li>
        </ol>
      </div>
    </div>
  );
}