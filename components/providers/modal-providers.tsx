import CreateServerModal from "@/components/modals/create-server-modal";
import InviteServerModal from "@/components/modals/invite-server-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateServerModal />
      <InviteServerModal />
    </>
  );
};
