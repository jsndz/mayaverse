"use client";

import React, { useEffect, useRef } from "react";
import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";

interface VideoCallProps {
  peerId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ peerId }) => {
  const { socket, peerConn } = useWebSocketStore();
  const { answer } = useCallStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const handleVideoCall = async () => {
    console.log("📞 Video call initiated");
    console.log("peerConn:", peerConn);
    console.log("peerId:", peerId);
    console.log("socket:", socket);

    const offer = await peerConn?.createOffer();
    await peerConn?.setLocalDescription(offer);

    console.log("Sending offer to", peerId, "with offer:", offer);

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "offer-video-call",
          payload: {
            offer,
            recieverId: peerId,
          },
        })
      );
      console.log("✅ Offer sent");
    } else {
      console.warn("❌ WebSocket is not open. Cannot send offer.");
    }

    if (!peerConn) return;

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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getTracks().forEach((track) => {
        peerConn.addTrack(track, stream);
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("❌ Error accessing media devices:", err);
    }
  };

  useEffect(() => {
    handleVideoCall();

    if (!answer || !peerConn) return;

    console.log("✅ Setting remote description with answer");

    if (answer?.answer) {
      peerConn.setRemoteDescription(new RTCSessionDescription(answer.answer));
    }
  }, [answer]);

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
