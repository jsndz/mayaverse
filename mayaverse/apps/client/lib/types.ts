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
}
export interface Chats {
  to: string | undefined;
  messages: Message | undefined;
}
export interface Message {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: Date;
}
