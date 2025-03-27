import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const user = await currentUser()
        const body = await request.json()

        if (!user || !user.id || !user?.emailAddresses[0].emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!body.name) {
            return new NextResponse("Invalid data", { status: 400 })
        }

        const newConversation = await db.conversation.create({
            data: {
                name: body.name,
                users: {
                    connect: [
                        {
                            clerkId: user.id
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        })
        
        return NextResponse.json(newConversation)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}