import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await currentProfile();

    if (!profile)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.log(await params);
    const channelId = (await params).id;
    const serverId = req.nextUrl.searchParams.get("serverId");

    if (
      !channelId ||
      !/^[0-9a-fA-F]{24}$/.test(channelId) ||
      !serverId ||
      !/^[0-9a-fA-F]{24}$/.test(serverId)
    )
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    if (!server)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ server });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
