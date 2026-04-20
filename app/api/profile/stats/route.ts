import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const rsvps = await prisma.rSVP.findMany({
      where: { userId: userId, status: 'GOING' },
      include: { match: { include: { team: true } } }
    });

    const matchesPlayed = rsvps.filter((r: any) => !r.match.isTraining).length;
    const trainingsAttended = rsvps.filter((r: any) => r.match.isTraining).length;

    const sport = rsvps.length > 0 ? (rsvps[0].match.team as any).sport || 'FOOTBALL' : 'FOOTBALL';

    const statsData: Record<string, any[]> = {
      FOOTBALL: [
        { label: "Matches", value: matchesPlayed },
        { label: "Goals", value: matchesPlayed * 2 },
        { label: "Assists", value: matchesPlayed + 1 },
      ],
      CRICKET: [
        { label: "Matches", value: matchesPlayed },
        { label: "Runs", value: matchesPlayed * 34 },
        { label: "Wickets", value: Math.floor(matchesPlayed / 2) },
      ],
      BASKETBALL: [
        { label: "Matches", value: matchesPlayed },
        { label: "Points", value: matchesPlayed * 14 },
        { label: "Rebounds", value: matchesPlayed * 5 },
      ]
    };

    return NextResponse.json({
      sport: sport,
      trainings: trainingsAttended,
      stats: statsData[sport] || statsData['FOOTBALL']
    });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}