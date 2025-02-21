import { useRef, useEffect } from "react";

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
interface CanvasProps {
  currentUser: User | null;
  users: User[];
}

const Arena: React.FC<CanvasProps> = ({ currentUser, users }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;

      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    };

    const drawUser = (user: User | null, label: string, color: string) => {
      if (
        !user ||
        user.position.x === undefined ||
        user.position.y === undefined
      )
        return;

      const x = user.position.x * 50;
      const y = user.position.y * 50;

      ctx.beginPath();
      ctx.arc(x + 3, y + 3, 22, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y + 35);
    };

    const render = () => {
      drawGrid();
      if (currentUser) drawUser(currentUser, "You", "#FF6B6B");
      users.forEach((user) => drawUser(user, `User ${user.id}`, "#4ECDC4"));
    };

    requestAnimationFrame(render);
  }, [currentUser, users]);

  return <canvas ref={canvasRef} style={{ border: "1px solid black" }} />;
};

export default Arena;
