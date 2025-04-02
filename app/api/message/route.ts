import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher"

export async function POST(request: Request) {
    try {
        const user = await currentUser()
        const body = await request.json()

        const { message, image, conversationId, isVote } = body

        if (!user || !user.id || !user?.emailAddresses[0].emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!message && !image && isVote == null) {
            return new NextResponse("Invalid data", { status: 400 });
        }

        if (!isVote) {
            const newMessage = await db.message.create({
                data: {
                    body: message,
                    image,
                    conversation: {
                        connect: {
                            id: conversationId
                        }
                    },
                    sender: {
                        connect: {
                            clerkId: user.id
                        }
                    },
                    seen: {
                        connect: {
                            clerkId: user.id
                        }
                    }
                },
                include: {
                    seen: true,
                    sender: true
                }
            })

            const updatedConversation = await db.conversation.update({
                where: {
                    id: conversationId
                },
                data: {
                    lastMessageAt: new Date(),
                    messages: {
                        connect: {
                            id: newMessage.id
                        }
                    }
                },
                include: {
                    users: true,
                    messages: {
                        include: {
                            seen: true
                        }
                    }
                }
            })

            await pusherServer.trigger(conversationId, 'messages:new', newMessage)

            const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]

            updatedConversation.users.map((conversationUser) => {
                pusherServer.trigger(conversationUser.clerkId, "conversation:update", {
                    id: conversationId,
                    messages: [lastMessage]
                })
            })

            return NextResponse.json(newMessage)
        } else {
            const newMessage = await db.message.create({
                data: {
                    isVote: true,
                    conversation: {
                        connect: {
                            id: conversationId
                        }
                    },
                    sender: {
                        connect: {
                            clerkId: user.id
                        }
                    },
                    seen: {
                        connect: {
                            clerkId: user.id
                        }
                    }
                }
            })

            const newVoteSession = await db.voteSession.create({
                data: {
                    message: {
                        connect: {
                            id: newMessage.id
                        }
                    },
                    conversation: {
                        connect: {
                            id: conversationId
                        }
                    },
                    sender: {
                        connect: {
                            clerkId: user.id
                        }
                    }
                }
            })

            const updatedMessage = await db.message.update({
                where: {
                    id: newMessage.id
                },
                data: {
                    voteSessionId: newVoteSession.id
                },
                include: {
                    voteSession: true,
                    seen: true,
                    sender: true
                }
            })

            const updatedConversation = await db.conversation.update({
                where: {
                    id: conversationId
                },
                data: {
                    lastMessageAt: new Date(),
                    messages: {
                        connect: {
                            id: updatedMessage.id
                        }
                    }
                },
                include: {
                    users: true,
                    messages: {
                        include: {
                            seen: true
                        }
                    }
                }
            })

            await pusherServer.trigger(conversationId, 'messages:new', updatedMessage)

            const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]

            updatedConversation.users.map((conversationUser) => {
                pusherServer.trigger(conversationUser.clerkId, "conversation:update", {
                    id: conversationId,
                    messages: [lastMessage]
                })
            })

            return NextResponse.json(updatedMessage)
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}