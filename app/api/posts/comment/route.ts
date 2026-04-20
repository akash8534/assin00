import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { postId, text, userId, userName } = await request.json();
    const newComment = await prisma.comment.create({
      data: { postId, text, userId, userName }
    });
    return NextResponse.json(newComment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}