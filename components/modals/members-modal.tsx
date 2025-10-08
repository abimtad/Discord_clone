"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/lib/hooks/use-modal-store";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  MoveRight,
  ShieldQuestion,
  Check,
  ChevronRight,
  Divide,
  Loader2,
  Gavel,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuSubTrigger } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import axios from "axios";

// NOTE: Without <form>, you won't get native form behavior like submission on Enter key press or browser validation fallback.
// You can use RHF without a form tag, but you lose these native conveniences and must handle submission differently.
const memberIcons = {
  GUEST: <Shield className="size-4" />,
  ADMIN: <ShieldCheck className="size-4 text-rose-300" />,
  MODERATOR: <ShieldAlert className="size-4" />,
};

function MembersModal() {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const server = data.server;
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const response = await axios.delete(
        `/api/members/${memberId}?serverId=${server?.id}`
      );

      onOpen("members", response.data);
    } catch (error) {
      console.log("[onKick]", error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: string) => {
    try {
      setLoadingId(memberId);

      const response = await axios.patch(
        `/api/members/${memberId}?serverId=${server?.id}`,
        { role }
      );

      onOpen("members", response.data);
      console.log("server from client", data);
    } catch (err) {
      console.log("[update role]: ", err);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-foreground">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-2">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex gap-x-2 mb-3 items-center">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col">
                <p className="text-zinc-400 text-bold flex gap-x-2 items-center">
                  {member.profile.name}
                  {memberIcons[member.role]}
                </p>
                <p className="text-zinc-500 text-xs">{member.profile.email}</p>
              </div>
              {member.role !== "ADMIN" && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-zinc-500">
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion className="mr-2 size-4" />{" "}
                          <span>Role</span> <ChevronRight className="ml-auto" />
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              className="flex"
                              onClick={() =>
                                onRoleChange(member.id, "MODERATOR")
                              }
                            >
                              <ShieldAlert className="size-4" />
                              <span>Moderator</span>
                              {member.role === "MODERATOR" && (
                                <Check className="ml-auto size-4" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex"
                              onClick={() => onRoleChange(member.id, "GUEST")}
                            >
                              <Shield className="size-4" />
                              <span>Guest</span>
                              {member.role === "GUEST" && (
                                <Check className="ml-auto size-4" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        <Gavel className="mr-2 size-4" /> Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin size-4 ml-auto text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default MembersModal;
