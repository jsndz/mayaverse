import { WebSocket } from "ws";

import jwt, { JwtPayload } from "jsonwebtoken";
import { RoomManager } from "./RoomManager";
import { OutgoingMessage } from "./types";
import client from "@repo/db/client";
import { JWT_SECRET } from "./config";
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
  public id?: string;
  private spaceId?: string;
  private x: number;
  private y: number;
  private userId?: string;
  private ws: WebSocket;
  constructor(ws: WebSocket) {
    this.id = generateRandomNumber(10);
    this.ws = ws;
    this.x = 0;
    this.y = 0;
    this.initHandlers();
  }
  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join":
          const spaceId = parsedData.payload.spaceId;
          const token = parsedData.payload.token;

          const userId = (jwt.verify(token, JWT_SECRET!) as JwtPayload).userId;
          if (!userId) {
            this.ws.close();
            return;
          }
          this.userId = userId;
          const space = await client.space.findFirst({
            where: {
              id: spaceId,
            },
          });

          if (!space) {
            this.ws.close();
            return;
          }
          this.spaceId = spaceId;
          RoomManager.getInstance().addUser(spaceId, this);

          this.x = Math.floor(Math.random() * space?.width);
          this.y = Math.floor(Math.random() * space?.height);
          this.send({
            type: "space-joined",
            payload: {
              spawn: {
                x: this.x,
                y: this.y,
              },
              id: userId,
              users:
                RoomManager.getInstance()
                  .rooms.get(spaceId)
                  ?.filter((x) => x.id !== this.id)
                  ?.map((u) => ({ id: u.id })) ?? [],
            },
          });

          RoomManager.getInstance().broadcast(
            {
              type: "user-joined",
              payload: {
                x: this.x,
                y: this.y,
                userId: this.userId,
              },
              spaceId: this.spaceId,
            },
            this,
            this.spaceId!
          );
          break;
        case "movement":
          const moveX = parsedData.payload.x;
          const moveY = parsedData.payload.y;
          const displacementX = Math.abs(this.x - moveX);
          const displacementY = Math.abs(this.y - moveY);
          if (
            (displacementX == 1 && displacementY == 0) ||
            (displacementX == 0 && displacementY == 1)
          ) {
            this.x = moveX;
            this.y = moveY;
            RoomManager.getInstance().broadcast(
              {
                type: "movement",
                payload: {
                  x: this.x,
                  y: this.y,
                },
              },
              this,
              this.spaceId!
            );
            return;
          }

          this.send({
            type: "movement-rejected",
            payload: {
              x: this.x,
              y: this.y,
            },
          });
      }
    });
  }
  destroy() {
    RoomManager.getInstance().broadcast(
      {
        type: "user-left",
        payload: {
          userId: this.userId,
        },
      },
      this,
      this.spaceId!
    );
    RoomManager.getInstance().removeUser(this, this.spaceId!);
  }
  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
}
