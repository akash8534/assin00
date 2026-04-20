import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { teamId, location, dateTime } = await request.json();

    const newTraining = await prisma.match.create({
      data: {
        teamId,
        opponent: "Training Squad",
        isTraining: true,
        location,
        date: new Date(dateTime), // Parses the combined Date + Time
      }
    });

    return NextResponse.json(newTraining);
  } catch (error) {
    console.error("Training Creation Error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}