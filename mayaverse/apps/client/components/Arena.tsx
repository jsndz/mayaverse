import { getUsersMeta, getUsersMetaBulk } from "@/endpoint/endpoint";
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
  const wsref = useRef<WebSocket | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Map<string, User>>(new Map());

  const dimension = useMemo(() => {
    const [width, height] = spaceDimension.split("x").map(Number);
    return { width: width || 0, height: height || 0 };
  }, [spaceDimension]);

  const token = localStorage.getItem("token");

  async function getUserdata(users: string) {
    const userData = await getUsersMeta(token!, users);
    return userData;
  }

  useEffect(() => {
    if (!ws_url) return;

    wsref.current = new WebSocket(ws_url);

    wsref.current.onopen = async () => {
      if (wsref.current && token) {
        wsref.current.send(
          JSON.stringify({
            type: "join",
            payload: {
              spaceId: spaceId,
              token: token,
            },
          })
        );
      }
    };

    wsref.current.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      handleWSEvent(message);
    };

    return () => {
      if (wsref.current) {
        wsref.current.close();
      }
    };
  }, [spaceId, token]);

  const handleWSEvent = (message: any) => {
    switch (message.type) {
      case "space-joined": {
        const fetchCurrentUser = async () => {
          const userData = await getUserdata(message.payload.id);

          setCurrentUser({
            avatar: userData.avatar,
            name: userData.name,
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
        };
        fetchCurrentUser();
        break;
      }

      case "user-joined": {
        const fetchUserData = async () => {
          try {
            const userData = await getUserdata(message.payload.userId);

            setUsers((prevUsers) => {
              const newUsers = new Map(prevUsers);
              newUsers.set(message.payload.userId, {
                id: message.payload.userId,
                avatar: userData.avatar,
                name: userData.name,
                position: {
                  x: message.payload.x,
                  y: message.payload.y,
                },
              });
              return newUsers;
            });
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };

        fetchUserData();
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
                position: {
                  x: message.event.x,
                  y: message.event.y,
                },
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
        break;
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

    users.forEach((user) => {
      drawUser(ctx, user);
    });

    if (currentUser) {
      drawUser(ctx, currentUser);
    }
  }, [dimension, currentUser, users]);

  const drawUser = (ctx: CanvasRenderingContext2D, user: User) => {
    if (!user.position) return;

    const img = new Image();
    img.src = user.avatar || "";
    img.alt = user.name || "X";

    img.onerror = () => {
      ctx.beginPath();
      ctx.arc(user.position.x, user.position.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = "#777";
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(user.name || "?", user.position.x, user.position.y + 25);
    };

    img.onload = () => {
      ctx.drawImage(img, user.position.x - 15, user.position.y - 15, 30, 30);
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(user.name || "", user.position.x, user.position.y + 25);
    };
  };

  return <canvas ref={canvasRef} style={{ border: "1px solid black" }} />;
};

export default Arena;
