import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";

const getCurrentUserConversations = async () => {
  const user = await currentUser();
  try {
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        users: {
          some: {
            clerkId: user?.clerkId,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return [];
  }
};

export default getCurrentUserConversations;
