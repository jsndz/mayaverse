import { Page } from "@/lib/types";
import { create } from "zustand";

type PageState = {
  page: Page;
  setPage: (page: Page) => void;
};

export const usePageStore = create<PageState>((set) => ({
  page: Page.arena,
  setPage: (page: Page) => set({ page: page }),
}));
