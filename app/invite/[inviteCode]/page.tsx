import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: Promise<{ inviteCode: string }>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();
  const { inviteCode } = await params;

  if (!user) {
    return redirectToSignIn();
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const existingConversation = await db.conversation.findFirst({
    where: {
      inviteCode,
      users: {
        some: {
          id: user.id,
        },
      },
    },
  });

  if (existingConversation) {
    return redirect(`/conversation/${existingConversation.id}`);
  }

  const conversation = await db.conversation.update({
    where: {
      inviteCode,
    },
    data: {
      users: {
        connect: [
          {
            id: user.id,
          },
        ],
      },
    },
  });

  if (conversation) {
    return redirect(`/conversation/${conversation.id}`);
  }

  return null;
};

export default InviteCodePage;
