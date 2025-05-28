"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";

interface VideoCallProps {
  peerId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ peerId }) => {
  const { socket, peerConn } = useWebSocketStore();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleVideoCall = async () => {
    console.log("📞 Video call initiated");
    console.log("peerConn:", peerConn);
    console.log("peerId:", peerId);
    console.log("socket:", socket);

    if (!peerConn || !stream) return;

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

    stream.getTracks().forEach((track) => {
      peerConn.addTrack(track, stream);
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  };

  useEffect(() => {
    const getMedia = async () => {
      if (
        typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        navigator.mediaDevices?.getUserMedia
      ) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setStream(mediaStream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error("❌ Error accessing media devices:", err);
        }
      } else {
        console.warn(
          "❌ navigator.mediaDevices.getUserMedia is not available."
        );
      }
    };

    getMedia();
  }, []);

  useEffect(() => {
    if (stream) {
      handleVideoCall();
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

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
