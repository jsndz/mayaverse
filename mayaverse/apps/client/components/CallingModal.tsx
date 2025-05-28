import { getOrCreateLocalStream } from "@/lib/getOrCreateLocalStream";
import { Page } from "@/lib/types";
import { useCallStore } from "@/store/useCallStore";
import { useStreamStore } from "@/store/useStreamStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import React, { useEffect, useRef } from "react";

interface VideoCallProps {
  peerId: string;
  setPage: (page: Page) => void;
}

const CallingModal: React.FC<VideoCallProps> = ({ peerId, setPage }) => {
  const { socket, peerConn } = useWebSocketStore();
  const { answer } = useCallStore();
  const { setLocalStream, setRemoteStream } = useStreamStore();
  const tracksAddedRef = useRef(false);
  const call = async () => {
    const stream = await getOrCreateLocalStream();

    setLocalStream(stream);
    if (!tracksAddedRef.current) {
      stream.getTracks().forEach((track) => {
        peerConn?.addTrack(track, stream);
      });
      tracksAddedRef.current = true;
    }

    const remoteStream = new MediaStream();

    if (peerConn) {
      peerConn.ontrack = (event) => {
        const stream = event.streams[0];
        setRemoteStream(stream);
      };
    }

    const offer = await peerConn?.createOffer();
    await peerConn?.setLocalDescription(offer);

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
    } else {
      console.warn("❌ WebSocket is not open. Cannot send offer.");
    }
  };

  useEffect(() => {
    call();
  }, []);

  useEffect(() => {
    if (peerConn?.signalingState === "stable") return;

    if (answer) {
      peerConn?.setRemoteDescription(new RTCSessionDescription(answer.answer));
    }
    setPage(Page.members);
  }, [answer]);

  return <div>Calling ...</div>;
};

export default CallingModal;
