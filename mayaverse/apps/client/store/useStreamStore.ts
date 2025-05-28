import { create } from "zustand";

interface CallState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  setLocalStream: (stream: MediaStream) => void;
  setRemoteStream: (stream: MediaStream) => void;
  clearStreams: () => void;
}

export const useStreamStore = create<CallState>((set) => ({
  localStream: null,
  remoteStream: null,
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  clearStreams: () => set({ localStream: null, remoteStream: null }),
}));
