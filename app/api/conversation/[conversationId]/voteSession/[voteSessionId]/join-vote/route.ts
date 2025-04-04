import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ voteSessionId: string }> }) {
    try {
        const user = await currentUser()
        const { voteSessionId } = await params
        const body = await request.json()
        const { isVoter } = body

        if (!user || !user.id || !user?.emailAddresses[0].emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const helper = await db.user.findUnique({
            where: {
                clerkId: user.id
            }
        })

        if (!helper) {
            return new NextResponse("User not found", { status: 404 });
        }


        const existingVoteSessionMember = await db.voteSessionMember.findFirst({
            where: {
                userId: helper.id,
                voteSessionId: voteSessionId
            }
        })

        if (!existingVoteSessionMember) {
            const newVoteSessionMember = await db.voteSessionMember.create({
                data: {
                    isVoter,
                    user: {
                        connect: {
                            clerkId: user.id
                        }
                    },
                    voteSession: {
                        connect: {
                            id: voteSessionId
                        }
                    }
                }
            })

            const updatedVoteSession = await db.voteSession.update({
                where: {
                    id: voteSessionId
                },
                data: {
                    members: {
                        connect: {
                            id: newVoteSessionMember.id
                        }
                    }
                },
                include: {
                    conversation: true,
                    sender: true,
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            })

            await pusherServer.trigger(voteSessionId, "voteSession_join:new", updatedVoteSession)

            return NextResponse.json(updatedVoteSession)
        } else {
            await db.voteSessionMember.update({
                where: {
                    id: existingVoteSessionMember.id,
                },
                data: {
                    isVoter
                }
            })

            const updatedVoteSession = await db.voteSession.findUnique({
                where: {
                    id: voteSessionId
                },
                include: {
                    conversation: true,
                    sender: true,
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            })

            await pusherServer.trigger(voteSessionId, "voteSession_join:new", updatedVoteSession)

            return NextResponse.json(updatedVoteSession)
        }

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
