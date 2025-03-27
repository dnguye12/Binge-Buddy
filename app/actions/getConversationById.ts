import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

const getConversationById = async (conversationId: string) => {
    try {
        const user = await currentUser()
        
        if (!user) {
            return null
        }

        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })
        return conversation
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error)
        return null
    }
}

export default getConversationById