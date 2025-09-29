import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { v4 } from "uuid";

type params = Promise<{ id: string }>;

export async function PATCH(request: Request, segmentData: { params: params }) {
  const user = await currentProfile();

  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const params = await segmentData.params;
  const serverId = params.id;

  const server = await db.server.update({
    where: { id: serverId, profileId: user.id },
    data: { inviteCode: v4() },
  });

  if (!server)
    return Response.json({ error: "Server not found" }, { status: 404 });

  return Response.json(server, { status: 200 });
}
