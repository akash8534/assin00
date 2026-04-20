import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { matchId, score } = await request.json();
    
    // Save the score to the match
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: { score }
    });

    return NextResponse.json(updatedMatch);
  } catch (error) {
    console.error("Score API Error:", error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}