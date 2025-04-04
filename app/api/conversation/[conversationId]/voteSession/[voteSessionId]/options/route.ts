import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ voteSessionId: string }> },
) {
  try {
    const user = await currentUser();
    const { voteSessionId } = await params;
    const body = await request.json();
    const { platforms, genres } = body;

    if (!user || !user.id || !user?.emailAddresses[0].emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!platforms || !genres) {
      return new NextResponse("Invalid Data", { status: 400 });
    }

    const updatedVoteSession = await db.voteSession.update({
      where: {
        id: voteSessionId,
      },
      data: {
        status: "BEFORE_VOTING",
        platforms,
        genres,
      },
      include: {
        conversation: true,
        sender: true,
      },
    });

    await pusherServer.trigger(
      voteSessionId,
      "voteSession_status:update",
      updatedVoteSession,
    );

    return NextResponse.json(updatedVoteSession);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
