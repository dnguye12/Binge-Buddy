import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function PATCH(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
    try {
        const user = await currentUser()
        const { conversationId } = await params

        if (!user || !user.id || !user?.emailAddresses[0].emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const conversation = await db.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                inviteCode: uuidv4()
            }
        })

        return NextResponse.json(conversation)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}