import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ voteSessionId: string }> },
) {
  try {
    const user = await currentUser();
    const { voteSessionId } = await params;
    const body = await request.json();
    const { round, votes, superD } = body;

    if (!user || !user.id || !user?.emailAddresses[0].emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!round && !votes && !superD) {
      return new NextResponse("Invalid Data", { status: 400 });
    }

    const newVoteSessionVote = await db.voteSessionVote.create({
      data: {
        round,
        votes,
        superD,
        sender: {
          connect: {
            clerkId: user.id,
          },
        },
        voteSession: {
          connect: {
            id: voteSessionId,
          },
        },
      },
    });

    await pusherServer.trigger(
      voteSessionId,
      "voteSession_vote:new",
      newVoteSessionVote,
    );

    return NextResponse.json(newVoteSessionVote);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
