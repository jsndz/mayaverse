"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { io } from "socket.io-client";

interface Position {
  x: number;
  y: number;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  position: Position;
}

export default function Space() {
  const params = useParams();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    // TODO: Implement WebSocket connection
    const socket = io("YOUR_WEBSOCKET_SERVER");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("userMoved", (data: { userId: string; position: Position }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === data.userId
            ? { ...user, position: data.position }
            : user
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMove = (newPosition: Position) => {
    // Implement movement logic with boundaries
    const boundedPosition = {
      x: Math.max(0, Math.min(newPosition.x, window.innerWidth - 50)),
      y: Math.max(0, Math.min(newPosition.y, window.innerHeight - 50)),
    };

    setPosition(boundedPosition);
    // TODO: Emit position to WebSocket server
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted relative">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Space Name </h1>
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {users.map((user) => (
                <Avatar key={user.id} className="border-2 border-background">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button variant="outline">Leave Space</Button>
          </div>
        </nav>
      </header>

      <main className="relative h-[calc(100vh-73px)] overflow-hidden">
        {/* Collaboration Space */}
        <div
          className="absolute inset-0"
          onMouseMove={(e) => {
            if (e.buttons === 1) {
              handleMove({ x: e.clientX, y: e.clientY });
            }
          }}
        >
          {/* Current User Avatar */}
          <div
            className="absolute"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <Avatar className="border-2 border-primary">
              <AvatarImage src="/your-avatar.jpg" alt="You" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
          </div>

          {/* Other Users */}
          {users.map((user) => (
            <div
              key={user.id}
              className="absolute"
              style={{
                transform: `translate(${user.position.x}px, ${user.position.y}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <Avatar className="border-2 border-muted">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}