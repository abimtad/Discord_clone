import CreateServerModal from "@/components/modals/create-server-modal";
import InviteServerModal from "@/components/modals/invite-server-modal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/members-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import LeaveServerModal from "../modals/leave-server-modal";
import DeleteServerModal from "../modals/delete-server-modal";
import DeleteChannelModal from "../modals/delete-channel-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateServerModal />
      <EditServerModal />
      <InviteServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
    </>
  );
};
