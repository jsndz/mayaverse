import { Page } from "@/lib/types";
import { useCallStore } from "@/store/useCallStore";
import { useStreamStore } from "@/store/useStreamStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import React, { useEffect } from "react";

interface VideoCallProps {
  peerId: string;
  setPage: (page: Page) => void;
}

const CallingModal: React.FC<VideoCallProps> = ({ peerId, setPage }) => {
  const { socket, peerConn } = useWebSocketStore();
  const { answer } = useCallStore();
  const { setLocalStream, setRemoteStream } = useStreamStore();
  const call = async () => {
    console.log("Calling peer:", peerConn);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    stream.getTracks().forEach((track) => {
      peerConn?.addTrack(track, stream);
    });
    const remoteStream = new MediaStream();

    if (peerConn) {
      peerConn.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        setRemoteStream(remoteStream);
      };
    }
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
  }, []);

  useEffect(() => {
    if (!answer?.answer || peerConn?.remoteDescription) return;

    console.log("✅ Setting remote description with answer");
    peerConn?.setRemoteDescription(new RTCSessionDescription(answer.answer));
    setPage(Page.members);
  }, [answer]);

  return <div>Calling ...</div>;
};

export default CallingModal;
