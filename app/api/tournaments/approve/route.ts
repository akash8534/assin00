import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { appId } = await request.json();
    const approvedApp = await prisma.tournamentApp.update({
      where: { id: appId },
      data: { status: "APPROVED" }
    });
    return NextResponse.json(approvedApp);
  } catch (error) {
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}