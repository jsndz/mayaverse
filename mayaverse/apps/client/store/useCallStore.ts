import { create } from "zustand";

type CallState = {
  incomingCall: null | { from: string };
  offer: null | { offer: RTCSessionDescriptionInit | null };
  answer: null | { answer: RTCSessionDescriptionInit | null };

  showModal: boolean;
  setIncomingCall: (from: string, offer: RTCSessionDescriptionInit) => void;

  setAnswer: (answer: any) => void;
  clearCall: () => void;
};

export const useCallStore = create<CallState>((set) => ({
  incomingCall: null,
  offer: null,
  answer: null,
  showModal: false,

  setIncomingCall: (from, offer) =>
    set({ incomingCall: { from }, showModal: true, offer: { offer } }),

  setAnswer: (answer) => set({ answer: { answer } }),

  clearCall: () =>
    set({
      incomingCall: null,
      offer: null,
      answer: null,
      showModal: false,
    }),
}));
