import { Page } from "@/lib/types";
import { useCallStore } from "@/store/useCallStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import React, { useEffect } from "react";
interface VideoCallProps {
  peerId: string;
  setPage: (page: Page) => void;
}

const CallingModal: React.FC<VideoCallProps> = ({ peerId, setPage }) => {
  const { socket, peerConn } = useWebSocketStore();
  const { answer } = useCallStore();

  const call = async () => {
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
  };
  useEffect(() => {
    call();

    if (!answer || !peerConn) return;

    console.log("✅ Setting remote description with answer");

    if (answer?.answer) {
      peerConn.setRemoteDescription(new RTCSessionDescription(answer.answer));
      setPage(Page.members);
    }
  }, [answer]);

  return <div>Calling ...</div>;
};

export default CallingModal;
