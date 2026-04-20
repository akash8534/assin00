import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { requestId, action } = await request.json(); // action = 'APPROVED' or 'REJECTED'

    const req = await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: action }
    });

    // If Captain approves, officially add the player to the roster
    if (action === 'APPROVED') {
      await prisma.user.update({
        where: { id: req.userId },
        data: { teamId: req.teamId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}