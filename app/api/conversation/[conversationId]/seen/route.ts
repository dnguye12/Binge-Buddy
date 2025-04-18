import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  try {
    const user = await currentUser();
    const { conversationId } = await params;

    if (!user || !user.id || !user?.emailAddresses[0].emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const updatedMessage = await db.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
        voteSession: true,
      },
      data: {
        seen: {
          connect: {
            clerkId: user.id,
          },
        },
      },
    });

    await pusherServer.trigger(user.id, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    });

    if (lastMessage.seenIds.indexOf(user.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      conversationId!,
      "messages:update",
      updatedMessage,
    );

    return NextResponse.json(updatedMessage);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
