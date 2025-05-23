import { create } from "zustand";

type CallState = {
  incomingCall: null | { from: string };
  showModal: boolean;
  setIncomingCall: (from: string) => void;
  clearCall: () => void;
};

export const useCallStore = create<CallState>((set) => ({
  incomingCall: null,
  showModal: false,
  setIncomingCall: (from) => set({ incomingCall: { from }, showModal: true }),
  clearCall: () => set({ incomingCall: null, showModal: false }),
}));
