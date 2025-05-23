import { create } from "zustand";

type CallState = {
  incomingCall: null | { from: string };
  offer: null | { offer: RTCSessionDescriptionInit | null };
  showModal: boolean;
  setIncomingCall: (from: string) => void;
  setOffer: (offer: any) => void;
  clearCall: () => void;
};

export const useCallStore = create<CallState>((set) => ({
  incomingCall: null,
  offer: null,
  showModal: false,

  setIncomingCall: (from) => set({ incomingCall: { from }, showModal: true }),

  setOffer: (offer) => set({ offer: { offer } }),

  clearCall: () =>
    set({
      incomingCall: null,
      offer: null,
      showModal: false,
    }),
}));
