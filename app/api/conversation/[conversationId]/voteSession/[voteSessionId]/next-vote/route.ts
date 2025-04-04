import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ voteSessionId: string }> },
) {
  try {
    const { voteSessionId } = await params;
    const body = await request.json();
    const { movies } = body;

    const voteSession = await db.voteSession.findUnique({
      where: {
        id: voteSessionId,
      },
      include: {
        voteSessionVotes: true,
      },
    });

    if (!voteSession) {
      return new NextResponse("Vote session not found", { status: 404 });
    }

    if (voteSession.status === "BEFORE_VOTING") {
      const updatedVoteSession = await db.voteSession.update({
        where: {
          id: voteSessionId,
        },
        data: {
          status: "ROUND_ONE",
        },
        include: {
          conversation: true,
          sender: true,
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      await pusherServer.trigger(
        voteSessionId,
        "voteSession_status:update",
        updatedVoteSession,
      );

      return NextResponse.json(updatedVoteSession);
    } else if (voteSession.status === "BEFORE_WATCHING") {
      const updatedVoteSession = await db.voteSession.update({
        where: {
          id: voteSessionId,
        },
        data: {
          status: "WATCHING",
        },
        include: {
          conversation: true,
          sender: true,
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      await pusherServer.trigger(
        voteSessionId,
        "voteSession_status:update",
        updatedVoteSession,
      );

      return NextResponse.json(updatedVoteSession);
    } else if (voteSession.status === "ROUND_ONE") {
      const trueCounts = new Array(6).fill(0);
      const superDList: number[] = [];

      for (const vote of voteSession.voteSessionVotes) {
        vote.votes.forEach((val, idx) => {
          if (val) {
            trueCounts[idx]++;
          }
        });
        superDList.push(vote.superD);
      }

      const uniqueSuperDList = [...new Set(superDList)];

      const maxVotes = Math.max(...trueCounts);
      const mostVotedIndex = trueCounts
        .map((count, index) => ({ count, index }))
        .filter((item) => item.count === maxVotes)
        .map((item) => item.index);

      const helper = mostVotedIndex.filter(
        (item) => !uniqueSuperDList.includes(item),
      );

      if (helper.length !== 1) {
        const updatedVoteSession = await db.voteSession.update({
          where: {
            id: voteSessionId,
          },
          data: {
            status: "ROUND_TWO",
          },
          include: {
            conversation: true,
            sender: true,
            members: {
              include: {
                user: true,
              },
            },
          },
        });

        await db.voteSessionVote.deleteMany({
          where: {
            voteSessionId: voteSessionId,
            round: 1,
          },
        });

        await pusherServer.trigger(
          voteSessionId,
          "voteSession_round_one:end",
          updatedVoteSession,
        );
      } else {
        const newMovie = await db.tMDBMovie.create({
          data: {
            overview: movies[mostVotedIndex[0]].overview,
            popularity: movies[mostVotedIndex[0]].popularity,
            poster_path: movies[mostVotedIndex[0]].poster_path,
            release_date: new Date(movies[mostVotedIndex[0]].release_date),
            title: movies[mostVotedIndex[0]].title,
            video: movies[mostVotedIndex[0]].video,
            vote_average: movies[mostVotedIndex[0]].vote_average,
            vote_count: movies[mostVotedIndex[0]].vote_count,
          },
        });

        const updatedVoteSession = await db.voteSession.update({
          where: {
            id: voteSessionId,
          },
          data: {
            status: "BEFORE_WATCHING",
            winner: {
              connect: {
                id: newMovie.id,
              },
            },
          },
          include: {
            conversation: true,
            sender: true,
            members: {
              include: {
                user: true,
              },
            },
          },
        });

        await db.voteSessionVote.deleteMany({
          where: {
            voteSessionId: voteSessionId,
          },
        });

        await pusherServer.trigger(
          voteSessionId,
          "voteSession_round_one:end",
          updatedVoteSession,
        );
      }

      return new NextResponse("", { status: 200 });
    } else if (voteSession.status === "ROUND_TWO") {
      const trueCounts = new Array(6).fill(0);

      for (const vote of voteSession.voteSessionVotes) {
        vote.votes.forEach((val, idx) => {
          if (val) {
            trueCounts[idx]++;
          }
        });
      }

      const maxVotes = Math.max(...trueCounts);

      const mostVotedIndex = trueCounts
        .map((count, index) => ({ count, index }))
        .filter((item) => item.count === maxVotes)
        .map((item) => item.index);

      let winnerIndex;

      if (mostVotedIndex.length === 1) {
        winnerIndex = mostVotedIndex[0];
      } else {
        winnerIndex = Math.floor(Math.random() * (mostVotedIndex.length + 1));
      }

      await pusherServer.trigger(
        voteSessionId,
        "voteSession_round_two:end",
        winnerIndex,
      );

      const newMovie = await db.tMDBMovie.create({
        data: {
          overview: movies[winnerIndex].overview,
          popularity: movies[winnerIndex].popularity,
          poster_path: movies[winnerIndex].poster_path,
          release_date: new Date(movies[winnerIndex].release_date),
          title: movies[winnerIndex].title,
          video: movies[winnerIndex].video,
          vote_average: movies[winnerIndex].vote_average,
          vote_count: movies[winnerIndex].vote_count,
        },
      });

      await db.voteSession.update({
        where: {
          id: voteSessionId,
        },
        data: {
          status: "BEFORE_WATCHING",
          winner: {
            connect: {
              id: newMovie.id,
            },
          },
        },
      });

      await db.voteSessionVote.deleteMany({
        where: {
          voteSessionId: voteSessionId,
        },
      });

      return NextResponse.json(winnerIndex);
    } else if (voteSession.status === "WATCHING") {
      const updatedVoteSession = await db.voteSession.update({
        where: {
          id: voteSessionId,
        },
        data: {
          status: "FINISHED",
        },
        include: {
          conversation: true,
          sender: true,
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      await pusherServer.trigger(
        voteSessionId,
        "voteSession_status:update",
        updatedVoteSession,
      );

      return NextResponse.json(updatedVoteSession);
    }
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
