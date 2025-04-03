import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
    try {
        const { conversationId } = await params

        if (!conversationId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const messages = await db.message.findMany({
            where: {
                conversationId: conversationId,
            },
            include: {
                sender: true,
                seen: true,
                voteSession: true
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        const normalizedMessages = messages.map((msg) => ({
            ...msg,
            voteSession: msg.voteSession ?? undefined,
        }));

        return NextResponse.json(normalizedMessages)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}