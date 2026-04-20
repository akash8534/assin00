import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { matchId, userId, status } = await request.json();

    const rsvp = await prisma.rSVP.upsert({
      where: {
        matchId_userId: { matchId, userId }
      },
      update: { status },
      create: { matchId, userId, status }
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error("RSVP Error:", error);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}