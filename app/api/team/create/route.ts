import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, sport, captainId } = await request.json();
    
    // Create a unique ID using a timestamp to prevent "Failed to create" errors
    const uniqueTeamId = `team_${Date.now()}`;

    const newTeam = await prisma.team.create({
      data: { 
        id: uniqueTeamId,
        name, 
        sport: sport.toUpperCase(), // Strictly enforces uppercase for DB compatibility
        captainId 
      }
    });

    return NextResponse.json(newTeam);
  } catch (error) {
    console.error("Team Creation API Error:", error);
    return NextResponse.json({ error: "Database error. Team name might be taken." }, { status: 500 });
  }
}