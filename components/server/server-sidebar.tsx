import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";

interface serverSidebarProps {
  serverId: string;
}

async function ServerSidebar({ serverId }: serverSidebarProps) {
  const profile = await currentProfile();
  const { redirectToSignIn } = await auth();

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

  const TextChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const VideoChannel = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const AudioChannel = server?.channels.filter(
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
    </div>
  );
}

export default ServerSidebar;
