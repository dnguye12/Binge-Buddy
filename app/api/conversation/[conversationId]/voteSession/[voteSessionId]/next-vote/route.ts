import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ voteSessionId: string }> }) {
    try {
        const { voteSessionId } = await params
        const body = await request.json()
        const { movies } = body

        const voteSession = await db.voteSession.findUnique({
            where: {
                id: voteSessionId
            }, include: {
                voteSessionVotes: true
            }
        })

        if (!voteSession) {
            return new NextResponse("Vote session not found", { status: 404 })
        }

        const trueCounts = new Array(6).fill(0)
        const superDList: number[] = []

        for (const vote of voteSession.voteSessionVotes) {
            vote.votes.forEach((val, idx) => {
                if (val) {
                    trueCounts[idx]++
                }
            })
            superDList.push(vote.superD)
        }

        const uniqueSuperDList = [...new Set(superDList)]

        const maxVotes = Math.max(...trueCounts)
        const mostVotedIndex = trueCounts.indexOf(maxVotes)

        const helper = uniqueSuperDList.includes(mostVotedIndex)

        if (helper) {
            await pusherServer.trigger(voteSessionId, "voteSession_round_one:end", -1)

            await db.voteSession.update({
                where: {
                    id: voteSessionId
                },
                data: {
                    status: "ROUND_TWO"
                }
            })

            await db.voteSessionVote.deleteMany({
                where: {
                    voteSessionId: voteSessionId,
                    round: 1
                }
            })
        } else {
            await pusherServer.trigger(voteSessionId, "voteSession_round_one:end", mostVotedIndex)

            const newMovie = await db.tMDBMovie.create({
                data: {
                    overview: movies[mostVotedIndex].overview,
                    popularity: movies[mostVotedIndex].popularity,
                    poster_path: movies[mostVotedIndex].poster_path,
                    release_date: new Date(movies[mostVotedIndex].release_date),
                    title: movies[mostVotedIndex].title,
                    video: movies[mostVotedIndex].video,
                    vote_average: movies[mostVotedIndex].vote_average,
                    vote_count: movies[mostVotedIndex].vote_count
                }
            })

            await db.voteSession.update({
                where: {
                    id: voteSessionId
                },
                data: {
                    status: "FINISHED",
                    winner: {
                        connect: {
                            id: newMovie.id
                        }
                    }
                }
            })

            await db.voteSessionVote.deleteMany({
                where: {
                    voteSessionId: voteSessionId,
                }
            })
        }

        return new NextResponse("", { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}