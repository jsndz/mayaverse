import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useParams } from "next/navigation";
import { off } from "node:process";
import React, { useEffect } from "react";

type RTCSignalMessage = {
  type: "video-answer";
  answer: RTCSessionDescriptionInit;
  to: string;
};

export const handleIncomingOffer = async (
  offer: RTCSessionDescriptionInit,
  callerId: string,
  socket: WebSocket | null,
  config: RTCConfiguration
) => {
  const peerConnection = new RTCPeerConnection(config);

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  const localVideo = document.getElementById(
    "local-video"
  ) as HTMLVideoElement | null;
  if (localVideo) {
    localVideo.srcObject = stream;
  }

  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  const answer = await peerConnection.createAnswer();

  await peerConnection.setLocalDescription(answer);

  const signalMessage: RTCSignalMessage = {
    type: "video-answer",
    answer: peerConnection.localDescription!,
    to: callerId,
  };

  socket?.send(JSON.stringify(signalMessage));

  return { peerConnection, stream };
};

const page = () => {
  const { id } = useParams<{ id: string }>();
  const { socket } = useWebSocketStore();

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
    handleIncomingOffer(offer, id, socket, configuration);
  };

  useEffect(() => {
    init();
  }, []);
  return <div>page</div>;
};

export default page;
