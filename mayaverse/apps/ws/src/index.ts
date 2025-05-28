import { WebSocketServer } from "ws";
import { User } from "./User";

const wss = new WebSocketServer({ port: 3002 });

wss.on("connection", function connection(ws) {
  let user = new User(ws);
  ws.on("error", console.error);
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "offer" || data.type === "answer") {
        console.log(
          `[SDP] ${data.type.toUpperCase()} from ${data.from} to ${data.to}`
        );
      } else if (data.candidate) {
        console.log(`[ICE] Candidate from ${data.from} to ${data.to}`);
      } else {
        console.log("[SIGNALING] Unknown message:", data);
      }
    } catch (err) {
      console.error("Invalid message:", err);
    }
  });

  ws.on("close", () => {
    user?.destroy();
  });
});

console.log("WebSocket server running at ws://localhost:3002");
