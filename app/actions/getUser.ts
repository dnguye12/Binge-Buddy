import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const getUsers = async () => {
  const user = await currentUser();

  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          clerkId: user?.id,
        },
      },
    });

    return users;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
