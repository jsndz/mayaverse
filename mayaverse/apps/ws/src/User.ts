import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "@repo/db/client";
function generateRandomNumber(digits: number) {
  let string = "";
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < digits; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return string;
}

export class User {
  public id: string = generateRandomNumber(10);
  constructor(private ws: WebSocket) {
    this.ws = ws;
  }
  initHandlers() {
    this.ws.on("message", (data) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join":
          const spaceId = parsedData.payload.spaceId;
          RoomManager.getInstance().addUser(spaceId, this);
          this.send({
            type: "space-joined",
            payload: {
              spawn: {
                x: Math.floor(100),
                y: Math.floor(100),
              },
              users:
                RoomManager.getInstance()
                  .rooms.get(spaceId)
                  ?.map((user) => ({
                    id: user.id,
                  })) ?? [],
            },
          });
          break;

        default:
          break;
      }
    });
  }
  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
}
