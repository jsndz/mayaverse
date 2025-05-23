import { create } from "zustand";

type WebSocketState = {
  socket: WebSocket | null;
  setSocket: (socket: WebSocket) => void;
};

export const useWebSocketStore = create<WebSocketState>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
