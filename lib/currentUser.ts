import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const currentUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  return user;
};
