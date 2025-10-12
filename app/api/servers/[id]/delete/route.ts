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
    if (server.profileId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete member records linking this profile to the server
    await db.server.delete({
      where: { id: serverId, profileId: profile.id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.log("[server:member leaving]: \n", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
