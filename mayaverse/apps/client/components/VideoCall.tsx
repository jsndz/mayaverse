"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { getOrCreateLocalStream } from "@/lib/getOrCreateLocalStream";
import { useStreamStore } from "@/store/useStreamStore";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { usePageStore } from "@/store/usePage";

interface VideoCallProps {
  PID?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ PID }) => {
  const { socket, peerConn } = useWebSocketStore();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { localStream, remoteStream, setLocalStream } = useStreamStore();
  const [error, setError] = useState<string | null>(null);
  const { PeerId } = usePageStore();
  const peerId = PID || PeerId;

  const handleVideoCall = async () => {
    if (!peerConn || !localStream) return;

    peerConn.onicecandidate = (event) => {
      if (event.candidate && socket?.readyState === WebSocket.OPEN && peerId) {
        socket.send(
          JSON.stringify({
            type: "ice-candidate",
            payload: event.candidate,
            to: peerId,
          })
        );
      }
    };

    peerConn.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  };

  useEffect(() => {
    if (!peerId) {
      setError("Peer ID is missing. Please select someone to start the call.");
      return;
    }

    const getMedia = async () => {
      try {
        const mediaStream = await getOrCreateLocalStream();
        setLocalStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media:", err);
        setError("Failed to access your camera and microphone.");
      }
    };

    getMedia();
  }, [peerId]);

  useEffect(() => {
    if (localStream) {
      handleVideoCall();
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      remoteStream?.getTracks().forEach((track) => track.stop());
    };
  }, [localStream, remoteStream]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-700 flex flex-col items-center justify-center px-6">
        <AlertTriangle className="w-10 h-10 mb-3" />
        <h2 className="text-xl font-bold text-center">
          Group Video Call is Under Construction...
        </h2>
        <p className="mt-2 text-center">{error}</p>
        <Button onClick={() => window.history.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Remote video (fullscreen) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Local video (small overlay) */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="absolute bottom-4 right-4 w-28 h-44 md:w-40 md:h-60 rounded-xl object-cover border-2 border-white z-10"
      />

      {/* Info header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center px-4 z-10">
        <span className="text-white font-medium text-sm sm:text-base">
          In Call with <span className="text-green-400">{peerId}</span>
        </span>
      </div>

      {/* Call controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
        <Button
          variant="destructive"
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-full text-base font-medium"
        >
          End Call
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
