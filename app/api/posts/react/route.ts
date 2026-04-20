import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// Notice how it is 'export async function POST' and NOT 'export default'
export async function POST(request: Request) {
  try {
    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } }
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Reaction API Error:", error);
    return NextResponse.json({ error: "Reaction failed" }, { status: 500 });
  }
}