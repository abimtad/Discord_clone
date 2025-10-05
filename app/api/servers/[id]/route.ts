import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  segmentedData: { params: Promise<{ id: string }> }
) {
  const profile = await currentProfile();

  if (!profile)
    return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
  const serverId = (await segmentedData.params).id;
  const { name, imageUrl } = await req.json();
  console.log("request body", req.body);

  try {
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: { name, imageUrl },
    });

    if (!server)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ message: "Server edited successfully !" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server error occurred !" },
      { status: 500 }
    );
  }
}
