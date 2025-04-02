import { db } from "@/lib/db";

const getVoteSession = async (voteSessionId: string) => {
    try {
        const voteSession = await db.voteSession.findUnique({
            where: {
                id: voteSessionId
            },
            include: {
                sender: true,
                conversation: true
            }
        })

        console.log(voteSessionId)
        console.log(voteSession)
        return voteSession
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
        return null;
    }
}

export default getVoteSession