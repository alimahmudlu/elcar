import { create } from "zustand";

interface DrawerState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
})); 