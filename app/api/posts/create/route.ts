import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { teamId, content, mediaUrl, mediaType } = await request.json();
    const newPost = await prisma.post.create({
      data: { teamId, content, mediaUrl, mediaType }
    });
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: "Post creation failed" }, { status: 500 });
  }
}