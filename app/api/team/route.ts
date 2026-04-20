import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId") || "t_fb";

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: true, // Gets the actual roster
        joinRequests: {
          where: { status: 'PENDING' }, // Gets pending applications
          include: { user: true }
        }
      }
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team data" }, { status: 500 });
  }
}