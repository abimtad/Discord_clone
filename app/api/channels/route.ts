import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const searchParams = req.nextUrl.searchParams;
    const { name, type } = await req.json();

    console.log("searchparams:", searchParams);

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serverId = searchParams.get("serverId");

    console.log("printing null", null);
    console.log("serverId api: ", serverId);

    // Handle cases where the client interpolated `undefined` into the query string
    // (e.g. `/api/channels?serverId=${undefined}` becomes `serverId=undefined`).
    if (!serverId || serverId === "undefined" || serverId.trim() === "") {
      console.log("missing id", serverId);
      return NextResponse.json({ error: "Server Id missing" }, { status: 400 });
    }

    // Basic validation for a Mongo ObjectId (24 hex characters). Return 400 if invalid.
    if (!/^[0-9a-fA-F]{24}$/.test(serverId)) {
      console.log("invalid server id format", serverId);
      return NextResponse.json({ error: "Invalid server id" }, { status: 400 });
    }

    if (name === "general") {
      return NextResponse.json(
        { error: "Name 'general' is reserved" },
        { status: 400 }
      );
    }

    const server = await db.server.findFirst({
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
    });

    if (!server) {
      console.log("no server");
      return NextResponse.json(
        { error: "Server not found or insufficient permissions" },
        { status: 403 }
      );
    }

    await db.channel.create({
      data: {
        profileId: profile.id,
        serverId: serverId,
        name,
        type,
      },
    });
    return NextResponse.json({ server }, { status: 201 });
  } catch (error) {
    console.log("channel server error: ", error);
    return NextResponse.json(
      { error: "Internal server error !" },
      { status: 500 }
    );
  }
}
