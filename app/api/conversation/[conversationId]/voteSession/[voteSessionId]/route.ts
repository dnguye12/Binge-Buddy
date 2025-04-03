import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: Promise<{ conversationId: string, voteSessionId: string }> }) {
    try {
        const { conversationId, voteSessionId } = await params

        if (!conversationId || !voteSessionId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const voteSession = await db.voteSession.findUnique({
            where: {
                id: voteSessionId,
                conversationId: conversationId
            },
            include: {
                conversation: true,
                sender: true,
                members: true
            }
        })

        return NextResponse.json(voteSession)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}