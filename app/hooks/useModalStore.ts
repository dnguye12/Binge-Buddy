import { create } from "zustand";
import { FullConversationType } from "../types";

export type ModalType =
  | "createGroup"
  | "invite"
  | "leaveGroup"
  | "members"
  | "image";

interface ModalData {
  conversation?: FullConversationType;
  image?: string;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
