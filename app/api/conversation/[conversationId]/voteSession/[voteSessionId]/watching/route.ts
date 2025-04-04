import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ voteSessionId: string }> },
) {
  try {
    const { voteSessionId } = await params;
    const body = await request.json();
    const { pause } = body;

    await pusherServer.trigger(
      voteSessionId,
      "voteSession_watching:status",
      pause,
    );
    return new NextResponse("", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
