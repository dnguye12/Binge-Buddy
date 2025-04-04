"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { FullConversationType } from "@/app/types";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ConversationBoxProps {
  conversation: FullConversationType;
  selected: boolean;
}

const ConversationBox = ({ conversation, selected }: ConversationBoxProps) => {
  const router = useRouter();
  const { user } = useUser();

  const handleClick = useCallback(() => {
    router.push(`/conversation/${conversation?.id}`);
  }, [conversation?.id, router]);

  const lastMessage = useMemo(() => {
    const messages = conversation?.messages || [];

    return messages[messages.length - 1];
  }, [conversation?.messages]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    return (
      seenArray.filter((seenUser) => seenUser.clerkId === user?.id).length !== 0
    );
  }, [lastMessage, user?.id]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-pointer items-center space-x-3 rounded-lg bg-white p-3 transition hover:bg-neutral-100",
        selected ? "bg-neutral-100" : "bg-white",
      )}
    >
      <div className="relative">
        <Avatar className="h-auto w-12 border drop-shadow-md">
          <AvatarImage src="https://images.freeimages.com/images/large-previews/962/avatar-man-with-mustages-1632966.jpg?fmt=webp&h=350" />
          <AvatarFallback>{conversation?.name}</AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              {conversation?.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs font-light text-gray-400">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={cn(
              "truncate text-sm",
              hasSeen ? "text-gray-500" : "font-medium text-black",
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
