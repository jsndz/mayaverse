import type { User } from "./User";
import { OutgoingMessage } from "./types";

export class RoomManager {
  rooms: Map<string, User[]> = new Map(); // creats a map that has rooms with spaceId and array of users
  static instance: RoomManager; // creates a instance of RoomManager which helps in accessing rooms through a static instance
  private constructor() {
    this.rooms = new Map(); //construct a object rooms
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new RoomManager(); // pass RoomManger and its properties to instance which will give us rooms through getInstance()
    }
    return this.instance;
  }
  public removeUser(user: User, spaceId: string) {
    if (!this.rooms.has(spaceId)) {
      return;
    }
    this.rooms.set(
      spaceId,
      this.rooms.get(spaceId)?.filter((u) => u.id != user.id) ?? []
    );
  }
  public addUser(spaceId: string, user: User) {
    if (!this.rooms.has(spaceId)) {
      this.rooms.set(spaceId, [user]); //this sets up the spaceId and Users
      return;
    }
    this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]); //adds the user to the existing list
  }

  public broadcast(message: OutgoingMessage, user: User, roomId: string) {
    if (!this.rooms.has(roomId)) {
      return;
    }
    this.rooms.get(roomId)?.forEach((u) => {
      if (u.id != user.id) {
        u.send(message);
      }
    });
  }

  public chat(message: OutgoingMessage, roomId: string, recieverId: string) {
    if (recieverId) {
      this.rooms
        .get(roomId)
        ?.find((u) => u.userId == recieverId)
        ?.send(message);
    }
  }
}
