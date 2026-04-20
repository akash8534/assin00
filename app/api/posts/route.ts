import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const teamId = searchParams.get("teamId");

  try {
    let whereClause = {};
    // SCOPING LOGIC: If it's a Player or Captain, only show their team's posts.
    // Fans and Organisers see all posts (League feed).
    if ((role === 'PLAYER' || role === 'CAPTAIN') && teamId) {
      whereClause = { teamId: teamId };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { team: { select: { name: true } } }
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}