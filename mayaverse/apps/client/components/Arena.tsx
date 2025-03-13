import { User } from "@/lib/types";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface ArenaProps {
  spaceDimension: string;
  spaceId: string;
}
const ws_url =
  process.env.NEXT_PUBLIC_STATE === "development"
    ? process.env.NEXT_PUBLIC_DEV_WS
    : process.env.NEXT_PUBLIC_PROD_WS;
const Arena: React.FC<ArenaProps> = ({ spaceDimension, spaceId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsref = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<Map<string, User>>(new Map());

  const dimension = useMemo(() => {
    const [width, height] = spaceDimension.split("x").map(Number);
    return { width: width || 0, height: height || 0 };
  }, [spaceDimension]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (ws_url) wsref.current = new WebSocket(ws_url);
    wsref.current.onopen = () => {
      wsref.current.send(
        JSON.stringify({
          type: "join",
          payload: {
            spaceId: spaceId,
            token: token,
          },
        })
      );
    };
    wsref.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      handleWSEvent(message);
    };

    return () => {
      if (wsref.current) {
        wsref.current.close();
      }
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
        console.log("movement-rejected");

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimension.width;
    canvas.height = dimension.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentUser) {
      ctx.beginPath();
      ctx.arc(
        currentUser.position.x,
        currentUser.position.y,
        5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "red";
      ctx.fill();
    }

    users.forEach((user) => {
      ctx.beginPath();
      ctx.arc(user.position.x, user.position.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();
    });
  }, [dimension, currentUser, users]);
  console.log(currentUser);
  console.log(users);
  return <canvas ref={canvasRef} style={{ border: "1px solid black" }} />;
};

export default Arena;
