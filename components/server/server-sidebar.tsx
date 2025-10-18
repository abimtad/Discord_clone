import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import ServerSection from "./server-section";
import { Separator } from "../ui/separator";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface serverSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
};
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 size-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 size-4 text-rose-500" />,
};

async function ServerSidebar({ serverId }: serverSidebarProps) {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server?.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5] flex flex-col">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-500 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="Channels"
              label="Text Channels"
              role={role!}
              channelType={ChannelType.TEXT}
              server={server}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                role={role!}
                channel={channel}
                key={channel.id}
                server={server}
              />
            ))}
          </div>
        )}
        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="Channels"
              label="Audio Channels"
              role={role!}
              channelType={ChannelType.AUDIO}
              server={server}
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                role={role!}
                channel={channel}
                key={channel.id}
                server={server}
              />
            ))}
          </div>
        )}
        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="Channels"
              label="Video Channels"
              role={role!}
              channelType={ChannelType.VIDEO}
              server={server}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                role={role!}
                channel={channel}
                key={channel.id}
                server={server}
              />
            ))}
          </div>
        )}
        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              label="members"
              role={role!}
              server={server}
            />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ServerSidebar;
