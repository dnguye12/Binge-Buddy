import { currentUser } from "@/lib/currentUser";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const user = await currentUser();
    const { conversationId } = await params;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
        users: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const updatedConversation = await db.conversation.update({
      where: {
        id: conversationId,
        users: {
          some: {
            id: user.id,
          },
        },
      },
      data: {
        users: {
          disconnect: {
            id: user.id,
          },
        },
      },
      include: {
        users: true,
      },
    });

    existingConversation.users.forEach((conversationUser) => {
      pusherServer.trigger(
        conversationUser.clerkId,
        "conversation:leave",
        existingConversation,
      );
    });

    if (updatedConversation.users.length === 0) {
      await db.conversation.delete({
        where: {
          id: updatedConversation.id,
        },
      });
    }

    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
