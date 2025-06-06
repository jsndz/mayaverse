"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FloatingDock } from "@/components/ui/floating-dock";
import { useToast } from "@/hooks/use-toast";

import Arena from "@/components/Arena";
import Chat from "@/components/Chat";
import { configuration } from "@/constants";
import { getSpaceData } from "@/endpoint/endpoint";
import { Chats, Page, SpaceData, User } from "@/lib/types";
import {
  generateRandomId,
  handleChatEvents,
  handleWSEvent,
} from "@/lib/websocket";
import { links } from "@/components/constants";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import VideoCall from "@/components/VideoCall";
import { usePageStore } from "@/store/usePage";

export default function Space() {
  const { id: spaceId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { setSocket, setPeerConn } = useWebSocketStore();

  const [isLoading, setIsLoading] = useState(true);
  const [spaceDimension, setSpaceDimension] = useState<string>();
  const { page, setPage } = usePageStore();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Map<string, User>>(new Map());

  const [selectedConversation, setSelectedConversation] = useState<User>();
  const [messages, setMessages] = useState<Chats[]>([]);

  const wsref = useRef<WebSocket | null>(null);
  const wsUrl =
    process.env.NEXT_PUBLIC_STATE === "development"
      ? process.env.NEXT_PUBLIC_DEV_WS
      : process.env.NEXT_PUBLIC_PROD_WS;
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const getSpace = async () => {
    try {
      const token = localStorage.getItem("token");
      const space: SpaceData = await getSpaceData(token!, spaceId);
      setSpaceDimension(space.dimension);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load space data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;
    setPeerConn(peerConnection);
    getSpace();

    if (!wsUrl || wsref.current) return;

    const token = localStorage.getItem("token");
    const socket = new WebSocket(wsUrl);
    wsref.current = socket;
    setSocket(socket);
    socket.onopen = () => {
      if (token) {
        socket.send(
          JSON.stringify({
            type: "join",
            payload: {
              spaceId,
              token,
            },
          })
        );
      }
    };

    socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      handleWSEvent(message, token!, setCurrentUser, setUsers);
      handleChatEvents(
        message,
        setMessages,
        currentUser?.id,
        peerConnectionRef
      );
    };

    return () => {
      socket.close();
      wsref.current = null;
    };
  }, []);

  const handleMessage = async (text: string) => {
    if (!wsref.current || isLoading || !selectedConversation) return;

    const messageId = generateRandomId();
    const newMessage = {
      id: messageId,
      text,
      timestamp: new Date(),
      isMe: true,
    };

    setMessages((prev) => {
      const updated = [...prev];
      const index = updated.findIndex(
        (chat) => chat.mate === selectedConversation.id
      );
      const isDuplicate = updated.some((chat) =>
        chat.messages?.some((m) => m.id === messageId)
      );

      if (isDuplicate) {
        return updated;
      }
      if (index !== -1) {
        updated[index].messages?.push(newMessage);
      } else {
        updated.push({
          mate: selectedConversation.id,
          messages: [newMessage],
        });
      }

      return updated;
    });

    wsref.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          messageId,
          recieverId: selectedConversation.id,
          message: text,
        },
      })
    );
  };

  if (isLoading || !currentUser) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
        <Loader />
      </div>
    );
  }

  if (!spaceDimension) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 bg-black text-white">
        <h2 className="text-xl font-semibold">Space Not Found</h2>
        <p className="text-muted-foreground">
          The requested space could not be found.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white">
      <main className="w-full h-full px-4 py-4 flex flex-col">
        <div className="w-full">
          <FloatingDock
            setPage={setPage}
            mobileClassName="translate-y-20"
            items={links}
          />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {page === Page.arena && currentUser && (
            <Arena
              currentUser={currentUser}
              users={users}
              spaceDimension={spaceDimension}
              spaceId={spaceId}
            />
          )}

          {page === Page.chat && (
            <Chat
              spaceId={spaceId}
              users={users}
              currentUser={currentUser}
              selectedConversation={selectedConversation!}
              messages={messages}
              setMessages={setMessages}
              setSelectedConversation={setSelectedConversation}
              handleMessage={handleMessage}
              setPage={setPage}
            />
          )}

          {page === Page.members && (
            <VideoCall PID={selectedConversation?.id!} />
          )}
        </div>
      </main>
    </div>
  );
}
