import { WebSocketServer } from "ws";
import { User } from "./User";

const wss = new WebSocketServer({ port: 3002, host: "0.0.0.0" });

wss.on("connection", function connection(ws) {
  let user = new User(ws);
  ws.on("error", console.error);

  ws.on("close", () => {
    user?.destroy();
  });
});

console.log("WebSocket server running at ws://localhost:3002");
