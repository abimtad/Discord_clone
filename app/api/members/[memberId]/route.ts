import MembersModal from "@/components/modals/members-modal";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { serverHooks } from "next/dist/server/app-render/entry-base";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile();
    const searchParams = req.nextUrl.searchParams;
    const memberId = (await params).memberId;
    const { role } = await req.json();
    console.log("[api]-role: ", role);

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serverId = searchParams.get("serverId");

    if (!serverId)
      return NextResponse.json({ error: "Server Id missing" }, { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: { id: "asc" },
        },
      },
    });

    console.log("[PATH]:", server);
    return NextResponse.json({ server }, { status: 200 });
  } catch (error) {
    console.log("PATH ERROR");
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile();
    const searchParams = req.nextUrl.searchParams;
    const memberId = (await params).memberId;

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serverId = searchParams.get("serverId");

    if (!serverId)
      return NextResponse.json({ error: "Server Id missing" }, { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: memberId,
          },
        },
      },
      include: {
        members: {
          include: { profile: true },
          orderBy: { id: "asc" },
        },
      },
    });

    console.log("[PATH]:", server);
    return NextResponse.json({ server }, { status: 200 });
  } catch (error) {
    console.log("PATH ERROR");
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
