"use client";

import ConversationBox from "./ConversationBox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModal } from "@/app/hooks/useModalStore";
import { FullConversationType } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

interface ConversationListProps {
  conversations: FullConversationType[];
}

const ConversationList = ({ conversations }: ConversationListProps) => {
  const { onOpen } = useModal();
  const { isLoaded, user } = useUser()
  const [items, setItems] = useState(conversations)

  const { conversationId, isOpen } = useConversation();

  useEffect(() => {
    if (!isLoaded || !user) {
      return
    }

    const pusherKey = user?.id

    pusherClient.subscribe(pusherKey)

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversationId })) {
          return current
        }

        return [conversation, ...current]
      })
    }

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) => current.map((currentConversation) => {
        if (currentConversation.id === conversation.id) {
          return {
            ...currentConversation,
            messages: conversation.messages
          }
        }

        return currentConversation
      }))
    }

    const leaveHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)]
      })
    }

    pusherClient.bind("conversation:new", newHandler)
    pusherClient.bind("conversation:update", updateHandler)
    pusherClient.bind("conversation:leave", leaveHandler)

    return () => {
      pusherClient.unsubscribe(pusherKey)
      pusherClient.unbind("conversation:new", newHandler)
      pusherClient.unbind("conversation:update", updateHandler)
      pusherClient.unbind("conversation:leave", leaveHandler)
    }
  }, [conversationId, isLoaded, user])

  return (
    <aside
      className={cn(
        "fixed inset-y-0 overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0",
        isOpen ? "hidden" : "left-0 block w-full",
      )}
    >
      <div className="px-5">
        <div className="flex items-center justify-between">
          <div className="py-4 text-2xl font-bold text-neutral-800">Groups</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => onOpen("createGroup")}
                  variant="outline"
                  size="icon"
                  className="cursor-pointer shadow-md"
                >
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new group</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {items.map((conversation) => (
          <ConversationBox
            key={conversation.id}
            conversation={conversation}
            selected={conversationId === conversation.id}
          />
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;
