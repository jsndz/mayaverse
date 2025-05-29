import { Page } from "@/lib/types";
import { create } from "zustand";

type PageState = {
  page: Page;
  PeerId?: string;
  setPage: (page: Page) => void;
  setPeerId: (peerId?: string) => void;
};

export const usePageStore = create<PageState>((set) => ({
  page: Page.arena,
  setPage: (page: Page) => set({ page }),
  setPeerId: (peerId?: string) => set({ PeerId: peerId }),
}));
