import { Dispatch, SetStateAction } from "react";

export interface Element {
  id: string;
  imageUrl: string;
  static: boolean;
  width: number;
  height: number;
}

export interface SpaceElement {
  id: string;
  element: Element;
  x: number;
  y: number;
}

export interface SpaceData {
  dimension: string;
  elements: SpaceElement[];
}

interface Position {
  x: number;
  y: number;
}
export interface User {
  id: string;
  name?: string;
  avatar?: string;
  position: Position;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface Links {
  title: string;
  icon: React.ReactNode;
  href: Page;
}

export enum Page {
  "arena",
  "chat",
  "settings",
  "members",
}

export interface ChatProps {
  spaceId: string;
  users: Map<string, User>;
  currentUser: User;
  selectedConversation: User;
  messages: Chats[];
  setMessages: Dispatch<SetStateAction<Chats[]>>;
  setSelectedConversation: Dispatch<SetStateAction<User | undefined>>;
  handleMessage: (message: string) => void;
}
export interface Chats {
  mate: string | undefined;
  messages: Message[] | undefined;
}
export interface Message {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: Date;
}
