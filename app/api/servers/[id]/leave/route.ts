import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await currentProfile();
    const serverId = (await segmentData.params).id;

    if (!profile)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!serverId)
      return NextResponse.json({ error: "server id missing" }, { status: 400 });

    // Find the server first
    const server = await db.server.findUnique({
      where: { id: serverId },
      select: { id: true, profileId: true },
    });

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    // Prevent the server owner from leaving their own server
    if (server.profileId === profile.id) {
      return NextResponse.json(
        { error: "Server owner cannot leave the server" },
        { status: 403 }
      );
    }

    // Delete member records linking this profile to the server
    const deleteResult = await db.member.deleteMany({
      where: { serverId: serverId, profileId: profile.id },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "You are not a member of this server" },
        { status: 404 }
      );
    }

    return NextResponse.json({ server });
  } catch (error) {
    console.log("[server:member leaving]: \n", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
