import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const inviteCode = (await params).id;
  const user = await currentProfile();
  const { redirectToSignIn } = await auth();

  if (!user) return redirectToSignIn();

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: { profileId: user.id },
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return null;
}
