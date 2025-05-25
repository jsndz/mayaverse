"use client";

import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useRouter } from "next/navigation";
import { useRef } from "react";
type RTCSignalMessage = {
  type: "video-answer";
  payload: {
    answer: RTCSessionDescriptionInit;
  };
  to: string;
};
export const handleIncomingOffer = async (
  offer: RTCSessionDescriptionInit,
  callerId: string,
  socket: WebSocket | null,
  config: RTCConfiguration,
  remoteVideoRef: React.RefObject<HTMLVideoElement>,
  localVideoRef: React.RefObject<HTMLVideoElement>
) => {
  const peerConnection = new RTCPeerConnection(config);

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  if (localVideoRef.current) {
    localVideoRef.current.srcObject = stream;
  }

  peerConnection.ontrack = (event) => {
    const remoteStream = event.streams[0];
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket?.send(
        JSON.stringify({
          type: "ice-candidate",
          payload: event.candidate,
          to: callerId,
        })
      );
    }
  };

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  const signalMessage: RTCSignalMessage = {
    type: "video-answer",
    payload: {
      answer: peerConnection.localDescription!,
    },
    to: callerId,
  };

  socket?.send(JSON.stringify(signalMessage));
};

export function IncomingCallModal() {
  const { incomingCall, showModal, clearCall } = useCallStore();
  const { socket } = useWebSocketStore();
  const router = useRouter();
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  if (!showModal || !incomingCall) return null;

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const init = async () => {
    const rawOfferWrapper = useCallStore.getState().offer;
    if (!rawOfferWrapper || !rawOfferWrapper.offer) {
      console.error("No valid offer found");
      return;
    }

    const offer: RTCSessionDescriptionInit = rawOfferWrapper.offer;
    await handleIncomingOffer(
      offer,
      incomingCall.from,
      socket,
      configuration,
      remoteVideoRef,
      localVideoRef
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <p className="text-xl">
          📞 Incoming video call from {incomingCall.from}
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={async () => {
              await init();
              // router.push(`/spaces/video/${incomingCall.from}`);
              clearCall();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Accept
          </button>
          <button
            onClick={() => clearCall()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Decline
          </button>
        </div>
        <div className="flex gap-4 mt-4">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-48 h-32 bg-black"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-48 h-32 bg-black"
          />
        </div>
      </div>
    </div>
  );
}
