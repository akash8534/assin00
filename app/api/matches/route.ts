import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { date: 'asc' },
      include: {
        team: { select: { name: true } },
        rsvps: true // CRITICAL: This pulls the live count data
      }
    });
    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}