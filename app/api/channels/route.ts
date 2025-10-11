import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const searchParams = req.nextUrl.searchParams;
    const { name, type } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return NextResponse.json({ error: "Server Id missing" }, { status: 400 });
    }

    if (name === "general") {
      return NextResponse.json({ error: "Server Id missing" }, { status: 400 });
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
      return NextResponse.json(
        { error: "Server not found or insufficient permissions" },
        { status: 403 }
      );
    }

    const channel = await db.channel.create({
      data: {
        profileId: profile.id,
        serverId: serverId,
        name,
        type,
      },
    });
    return NextResponse.json(channel, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error !" },
      { status: 500 }
    );
  }
}
