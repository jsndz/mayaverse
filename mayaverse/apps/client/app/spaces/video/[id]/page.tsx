"use client";

import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { socket, peerConn } = useWebSocketStore();
  const { answer } = useCallStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const handleVideoCall = async () => {
    console.log(" Video call initiated");

    if (!peerConn) return;

    peerConn.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.send(
          JSON.stringify({
            type: "ice-candidate",
            payload: event.candidate,
            to: id,
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

    const offer = await peerConn.createOffer();
    await peerConn.setLocalDescription(offer);

    socket?.send(
      JSON.stringify({
        type: "offer-video-call",
        payload: {
          offer,
          recieverId: id,
        },
      })
    );
  };

  useEffect(() => {
    if (!answer || !peerConn) return;

    console.log("Setting remote description with answer");

    if (answer?.answer) {
      peerConn.setRemoteDescription(new RTCSessionDescription(answer.answer));
    }
  }, [answer]);

  useEffect(() => {
    handleVideoCall();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2>🎥 In call with {id}</h2>
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

export default Page;
