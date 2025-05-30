import { getOrCreateLocalStream } from "@/lib/getOrCreateLocalStream";
import { Page } from "@/lib/types";
import { useCallStore } from "@/store/useCallStore";
import { useStreamStore } from "@/store/useStreamStore";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconPhoneOff, IconLoader2 } from "@tabler/icons-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoCallProps {
  peerId: string;
  setPage: (page: Page) => void;
}

const CallingModal: React.FC<VideoCallProps> = ({ peerId, setPage }) => {
  const { socket, peerConn } = useWebSocketStore();
  const { answer } = useCallStore();
  const { setLocalStream, setRemoteStream } = useStreamStore();
  const tracksAddedRef = useRef(false);
  const [status, setStatus] = useState("Calling...");

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
      setStatus("Ringing...");
    } else {
      console.warn("❌ WebSocket is not open. Cannot send offer.");
      setStatus("Connection error.");
    }
  };

  useEffect(() => {
    call();
  }, []);

  useEffect(() => {
    if (peerConn?.signalingState === "stable") return;

    if (answer) {
      peerConn?.setRemoteDescription(new RTCSessionDescription(answer.answer));
      setStatus("Connected!");
    }
    setTimeout(() => setPage(Page.members), 800); // delay transition
  }, [answer]);

  return (
    <Dialog open>
      <DialogContent className="w-full max-w-sm p-6 text-center bg-background border-border">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>

          <h2 className="text-xl font-semibold">Video Call</h2>
          <p className="text-muted-foreground">{status}</p>

          <IconLoader2 className="h-6 w-6 text-primary animate-spin" />

          <Button
            variant="destructive"
            className="mt-4 w-full"
            onClick={() => setPage(Page.members)}
          >
            <IconPhoneOff className="mr-2 h-4 w-4" />
            Cancel Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallingModal;
