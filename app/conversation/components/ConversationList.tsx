"use client";

import ConversationBox from "./ConversationBox";
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
import { usePathname } from "next/navigation";

interface ConversationListProps {
  conversations: FullConversationType[];
}

const ConversationList = ({ conversations }: ConversationListProps) => {
  const { onOpen } = useModal();
  const { isLoaded, user } = useUser();
  const [items, setItems] = useState(conversations);

  const { conversationId, isOpen } = useConversation();

  const path = usePathname()

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    const pusherKey = user?.id;

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversationId })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (!currentConversation ||!conversation) return currentConversation;
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation?.messages,
            };
          }

          return currentConversation;
        }),
      );
    };

    const leaveHandler = (conversation: FullConversationType) => {
      
      setItems((current) => {
        return current.filter((convo) => convo?.id !== conversation?.id)
      });
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:leave", leaveHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:leave", leaveHandler);
    };
  }, [conversationId, isLoaded, user]);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0",
        path.includes("/voteSession/") && "!hidden",
        isOpen ? "hidden" : "left-0 block w-full",
      )}
    >
      <div className="px-5">
        <div className="flex items-center justify-between">
          <div className="py-4 text-2xl font-bold text-neutral-800">Groups</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={() => onOpen("createGroup")}
                className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              >
                <Plus />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new group</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {items.map((conversation) => (
          <ConversationBox
            key={conversation?.id}
            conversation={conversation}
            selected={conversationId === conversation?.id}
          />
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;
