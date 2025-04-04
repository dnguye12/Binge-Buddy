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

    if (!user || !user.id || !user?.emailAddresses[0].emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const voteSession = await db.voteSession.findUnique({
      where: {
        id: voteSessionId,
      },
    });

    if (!voteSession) {
      return new NextResponse("Vote session not found", { status: 404 });
    }

    let updatedReady: string[];
    if (voteSession.ready.includes(user.id)) {
      updatedReady = voteSession.ready.filter((r) => r !== user.id);
    } else {
      updatedReady = [...voteSession.ready, user.id];
    }

    const updatedVoteSession = await db.voteSession.update({
      where: {
        id: voteSessionId,
      },
      data: {
        ready: updatedReady,
      },
    });

    await pusherServer.trigger(
      voteSessionId,
      "voteSession_join_watch:patch",
      updatedReady,
    );

    return NextResponse.json(updatedVoteSession);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
