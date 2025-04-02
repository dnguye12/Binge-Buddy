import { db } from "@/lib/db";

const getMessages = async (conversationId: string) => {
  try {
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

    return normalizedMessages;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return [];
  }
};

export default getMessages;
