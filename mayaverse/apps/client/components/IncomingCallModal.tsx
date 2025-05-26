"use client";

import { Page } from "@/lib/types";
import { useCallStore } from "@/store/useCallStore";
import { usePageStore } from "@/store/usePage";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useRouter } from "next/navigation";
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
  config: RTCConfiguration
) => {
  const peerConnection = new RTCPeerConnection(config);

  try {
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
  } catch (err) {
    console.error("Error accessing media devices:", err);
  }
};

export function IncomingCallModal() {
  const { incomingCall, showModal, clearCall } = useCallStore();
  const { socket } = useWebSocketStore();
  const router = useRouter();
  const { page, setPage } = usePageStore();
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
    await handleIncomingOffer(offer, incomingCall.from, socket, configuration);
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
              setPage(Page.members);
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
      </div>
    </div>
  );
}
