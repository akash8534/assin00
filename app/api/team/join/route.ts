import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, inviteCode } = await request.json();

    // For the MVP, we use the Team ID directly as the secure invite code
    const team = await prisma.team.findUnique({ where: { id: inviteCode } });
    if (!team) return NextResponse.json({ error: "Invalid Team Code" }, { status: 404 });

    const newReq = await prisma.joinRequest.create({
      data: { userId, teamId: team.id }
    });

    return NextResponse.json({ success: true, req: newReq });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 });
  }
}