import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextResponse, NextRequest } from "next/server";
import { v4 } from "uuid";

export async function POST(req: NextRequest) {
  const { name, imageUrl } = await req.json();
  const profile = await currentProfile();

  if (!profile)
    return NextResponse.json(
      { statusCode: 401, message: "Unauthorized" },
      { status: 401 }
    );

  const server = await db.server.create({
    data: {
      profileId: profile.id,
      name,
      imageUrl,
      inviteCode: v4(),
      channels: {
        create: {
          profileId: profile.id,
          name: "general",
        },
      },
      members: {
        create: {
          profileId: profile.id,
          role: MemberRole.ADMIN,
        },
      },
    },
  });
  console.log("server:", server);
  return NextResponse.json({ message: "Server created successfully" });
}
