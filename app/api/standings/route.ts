import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all teams and their completed, non-training matches
    const teams = await prisma.team.findMany({
      include: {
        matches: {
          where: { 
            score: { not: null }, 
            isTraining: false 
          }
        }
      }
    });

    // Calculate standings dynamically
    const standings = teams.map(team => {
      let played = 0, won = 0, drawn = 0, lost = 0;

      team.matches.forEach(match => {
        if (!match.score) return;
        
        played++;
        // Parse the "2-1" string into numbers
        const [teamScore, oppScore] = match.score.split('-').map(Number);
        
        if (teamScore > oppScore) won++;
        else if (teamScore === oppScore) drawn++;
        else lost++;
      });

      return {
        id: team.id,
        team: team.name,
        played, won, drawn, lost,
        points: (won * 3) + (drawn * 1)
      };
    });

    // Sort by points (highest first)
    standings.sort((a, b) => b.points - a.points);

    return NextResponse.json(standings);
  } catch (error) {
    console.error("Standings API Error:", error);
    return NextResponse.json({ error: "Failed to calculate standings" }, { status: 500 });
  }
}