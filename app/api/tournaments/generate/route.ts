import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { tournamentId } = await request.json();

    // Get all approved teams for this tournament
    const approvedApps = await prisma.tournamentApp.findMany({
      where: { tournamentId, status: "APPROVED" },
      include: { team: true }
    });

    const teams = approvedApps.map(app => app.team);
    if (teams.length < 2) return NextResponse.json({ error: "Need at least 2 teams" }, { status: 400 });

    // Generate Round-Robin Matches
    let dateOffset = 1;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const matchDate = new Date();
        matchDate.setDate(matchDate.getDate() + dateOffset);
        
        await prisma.match.create({
          data: {
            teamId: teams[i].id,
            opponent: teams[j].name,
            isTraining: false,
            date: matchDate,
            location: "Main Stadium"
          }
        });
        dateOffset++; // Schedule next match for the next day
      }
    }

    // Update Tournament Status
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: "ACTIVE" }
    });

    return NextResponse.json({ success: true, message: "Fixtures Generated!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate fixtures" }, { status: 500 });
  }
}