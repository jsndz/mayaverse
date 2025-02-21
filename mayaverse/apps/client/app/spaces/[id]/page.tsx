"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import Arena from "@/components/Arena";
interface Position {
  x: number;
  y: number;
}

interface User {
  id: string;
  name?: string;
  avatar?: string;
  position: Position;
}

export default function Space() {
  const ws_url =
    process.env.NEXT_PUBLIC_STATE === "development"
      ? process.env.NEXT_PUBLIC_PROD_URL
      : process.env.NEXT_PUBLIC_PROD_WS;

  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const { id: spaceId } = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Use Map instead of an array
  const [users, setUsers] = useState<Map<string, User>>(new Map());

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");

    wsRef.current = new WebSocket("ws://localhost:3002");
    wsRef.current.onopen = () => {
      if (wsRef.current) {
        wsRef.current.send(
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

    wsRef.current.onmessage = (event) => {
      const eventType = JSON.parse(event.data);
      handleWSEvent(eventType);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const handleWSEvent = (message: any) => {
    switch (message.type) {
      case "space-joined": {
        setCurrentUser({
          id: message.payload.id,
          position: {
            x: message.payload.spawn.x,
            y: message.payload.spawn.y,
          },
        });

        // Convert users to a Map
        const newUsers = new Map<string, User>(
          message.payload.users.map((user: User) => [
            user.id,
            {
              ...user,
              position: user.position || { x: 0, y: 0 },
            },
          ])
        );

        setUsers(newUsers);
        break;
      }

      case "user-joined": {
        setUsers((prevUsers) => {
          const newUsers = new Map(prevUsers);
          newUsers.set(message.payload.userId, {
            id: message.payload.userId,
            position: {
              x: message.payload.x,
              y: message.payload.y,
            },
          });
          return newUsers;
        });
        break;
      }

      case "movement": {
        setUsers((prevUsers) => {
          const newUsers = new Map(prevUsers);
          const user = newUsers.get(message.payload.userId);

          if (user) {
            newUsers.set(message.payload.userId, {
              ...user,
              position: {
                x: message.payload.x,
                y: message.payload.y,
              },
            });
          }

          return newUsers;
        });
        break;
      }
      case "movement-rejected": {
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                x: message.event.x,
                y: message.event.y,
              }
            : prev
        );
        break;
      }
      case "user-left": {
        setUsers((prevUsers) => {
          const newUsers = new Map(prevUsers);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
      }
      default:
        break;
    }
  };
  const handleMovement = (newX: number, newY: number) => {
    if (!currentUser) {
      return;
    }
    wsRef.current?.send(
      JSON.stringify({
        type: "movement",
        x: newX,
        y: newY,
        userId: currentUser.id,
      })
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted relative">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Space Name </h1>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {Array.from(users.values()).map((user) => (
                <Avatar key={user.id} className="border-2 border-background">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button variant="outline">Leave Space</Button>
          </div>
        </nav>
      </header>

      <main className="relative h-[calc(100vh-73px)] overflow-hidden">
        <Arena currentUser={currentUser} users={Array.from(users.values())} />
      </main>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 space-x-2">
        <Button onClick={() => handleMovement(0, -1)}>↑</Button>
        <Button onClick={() => handleMovement(-1, 0)}>←</Button>
        <Button onClick={() => handleMovement(1, 0)}>→</Button>
        <Button onClick={() => handleMovement(0, 1)}>↓</Button>
      </div>
    </div>
  );
}
