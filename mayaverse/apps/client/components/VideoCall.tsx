"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { getOrCreateLocalStream } from "@/lib/getOrCreateLocalStream";
import { useStreamStore } from "@/store/useStreamStore";

interface VideoCallProps {
  peerId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ peerId }) => {
  const { socket, peerConn } = useWebSocketStore();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { localStream, remoteStream, setLocalStream } = useStreamStore();

  const handleVideoCall = async () => {
    if (!peerConn || !localStream) return;

    peerConn.onicecandidate = (event) => {
      if (event.candidate && socket?.readyState === WebSocket.OPEN) {
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
    const getMedia = async () => {
      try {
        const mediaStream = await getOrCreateLocalStream();
        setLocalStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media:", err);
      }
    };

    getMedia();
  }, []);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localStream) {
      handleVideoCall();
    }
  }, [localStream]);

  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      remoteStream?.getTracks().forEach((track) => track.stop());
    };
  }, [localStream]);

  return (
    <div className="p-4 text-white">
      <h2>🎥 In call with {peerId}</h2>
      <div className="flex gap-4 mt-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-1/2 h-64 bg-black"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-1/2 h-64 bg-black"
        />
      </div>
    </div>
  );
};

export default VideoCall;
