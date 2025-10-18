import { create } from "zustand";
import { serverWithMembersWithProfile } from "@/types/types";
import { ChannelType, Channel } from "../generated/prisma";

export type ModalType =
  | "createServer"
  | "editServer"
  | "invite"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel";

interface ModalData {
  server?: serverWithMembersWithProfile;
  channelType?: ChannelType;
  channel?: Channel;
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
