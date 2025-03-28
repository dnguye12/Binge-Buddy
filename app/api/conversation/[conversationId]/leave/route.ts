import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function PATCH(request: Request,{ params }: { params: Promise<{ conversationId: string }>} ) {
    try {
        const user = await currentUser()
        const { conversationId } = await params

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server = await db.conversation.update({
            where: {
                id: conversationId,
                users: {
                    some: {
                        id: user.id
                    }
                }
            },
            data: {
                users: {
                    deleteMany: {
                        id: user.id
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal error", { status: 500 })
    }
}