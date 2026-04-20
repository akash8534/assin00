import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { tournamentId, teamId } = await request.json();
    const app = await prisma.tournamentApp.create({
      data: { tournamentId, teamId }
    });
    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json({ error: "Application failed" }, { status: 500 });
  }
}