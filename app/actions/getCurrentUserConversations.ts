import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

const getCurrentUserConversations = async () => {
    const user = await currentUser()

    try {
        const conversations = await db.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc"
            },
            where: {
                users: {
                    some: {
                        clerkId: user?.id
                    }
                }
            }
        })

        return conversations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
        return []
    }
}

export default getCurrentUserConversations