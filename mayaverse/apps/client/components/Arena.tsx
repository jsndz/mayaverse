import { getUsersMeta, getUsersMetaBulk } from "@/endpoint/endpoint";
import { User } from "@/lib/types";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface ArenaProps {
  spaceDimension: string;
  spaceId: string;
  currentUser: User;
  users: Map<string, User>;
}

const ws_url =
  process.env.NEXT_PUBLIC_STATE === "development"
    ? process.env.NEXT_PUBLIC_DEV_WS
    : process.env.NEXT_PUBLIC_PROD_WS;

const Arena: React.FC<ArenaProps> = ({
  spaceDimension,
  spaceId,
  currentUser,
  users,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dimension = useMemo(() => {
    const [width, height] = spaceDimension.split("x").map(Number);
    return { width: width || 0, height: height || 0 };
  }, [spaceDimension]);

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
