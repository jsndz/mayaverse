"use client";

import { useStreamStore } from "@/store/useStreamStore";
import { useCallStore } from "@/store/useCallStore";
import { usePageStore } from "@/store/usePage";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useRouter } from "next/navigation";
import { getOrCreateLocalStream } from "@/lib/getOrCreateLocalStream";
import { configuration } from "@/constants";
import { Page } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconPhoneIncoming,
  IconPhoneX,
  IconPhoneCheck,
} from "@tabler/icons-react";

type RTCSignalMessage = {
  type: "video-answer";
  payload: {
    answer: RTCSessionDescriptionInit;
  };
  to: string;
};

const handleIncomingOffer = async (
  offer: RTCSessionDescriptionInit,
  callerId: string,
  socket: WebSocket | null,
  config: RTCConfiguration
) => {
  const { setSocket, setPeerConn, peerConn } = useWebSocketStore.getState();
  let tracksAdded = false;
  const { setLocalStream, setRemoteStream } = useStreamStore.getState();

  try {
    const stream = await getOrCreateLocalStream();
    setLocalStream(stream);

    if (!tracksAdded) {
      stream.getTracks().forEach((track) => {
        peerConn?.addTrack(track, stream);
      });
      tracksAdded = true;
    }

    const remoteStream = new MediaStream();
    if (peerConn) {
      peerConn.ontrack = (event) => {
        const stream = event.streams[0];
        setRemoteStream(stream);
      };
    }

    await peerConn?.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConn?.createAnswer();
    await peerConn?.setLocalDescription(answer);

    const signalMessage: RTCSignalMessage = {
      type: "video-answer",
      payload: {
        answer: peerConn?.localDescription!,
      },
      to: callerId,
    };

    socket?.send(JSON.stringify(signalMessage));
  } catch (err) {
    console.error("Error handling offer:", err);
  }
};

export function IncomingCallModal() {
  const { incomingCall, showModal, clearCall, offer } = useCallStore();
  const { socket } = useWebSocketStore();
  const { setPage, setPeerId } = usePageStore();

  if (!showModal || !incomingCall) return null;

  const acceptCall = async () => {
    if (!offer?.offer) {
      console.error("No valid offer found");
      return;
    }

    await handleIncomingOffer(
      offer.offer,
      incomingCall.from,
      socket,
      configuration
    );
    setPeerId(incomingCall.from);
    clearCall();
    setPage(Page.members);
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-sm p-6 text-center bg-background border-border">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>

          <h2 className="text-xl font-semibold flex items-center gap-2">
            <IconPhoneIncoming className="text-primary" />
            Incoming Call
          </h2>

          <p className="text-muted-foreground">
            {incomingCall.from} is calling you...
          </p>

          <div className="flex gap-4 mt-4">
            <Button
              variant="default"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={acceptCall}
            >
              <IconPhoneCheck className="mr-2 h-4 w-4" />
              Accept
            </Button>

            <Button variant="destructive" onClick={clearCall}>
              <IconPhoneX className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
