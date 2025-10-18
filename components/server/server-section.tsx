"use client";

import { ChannelType, MemberRole } from "@/lib/generated/prisma";
import { serverWithMembersWithProfile } from "@/types/types";
import ActionTooltip from "../Action-tooltip";
import { Plus, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/lib/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role: MemberRole;
  sectionType: string;
  channelType?: ChannelType;
  server?: serverWithMembersWithProfile;
}

function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 ">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "Channels" && (
        <ActionTooltip side="top" label="create Channel" align="start">
          <button
            onClick={() => onOpen("createChannel", { server, channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="size-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip side="top" label="Manage members" align="start">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}

export default ServerSection;
