import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        applications: {
          include: { team: true }
        }
      }
    });
    return NextResponse.json(tournaments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 });
  }
}