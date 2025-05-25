import { create } from "zustand";

type WebSocketState = {
  socket: WebSocket | null;
  setSocket: (socket: WebSocket) => void;
  peerConn: RTCPeerConnection | null;
  setPeerConn: (peerConn: RTCPeerConnection) => void;
};

export const useWebSocketStore = create<WebSocketState>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
  peerConn: null,
  setPeerConn: (peerConn) => set({ peerConn }),
}));
