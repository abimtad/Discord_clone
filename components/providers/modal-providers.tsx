import CreateServerModal from "@/components/modals/create-server-modal";
import InviteServerModal from "@/components/modals/invite-server-modal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/members-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateServerModal />
      <EditServerModal />
      <InviteServerModal />
      <MembersModal />
    </>
  );
};
