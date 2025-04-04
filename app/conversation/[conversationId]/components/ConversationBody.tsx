"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import VoteBox from "./VoteBox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationBodyProps {
  initialMessages: FullMessageType[];
  isVote: boolean;
}
const ConversationBody = ({
  initialMessages,
  isVote,
}: ConversationBodyProps) => {
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversation/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversation/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        }),
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("messages:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("messages:update", updateMessageHandler);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-[calc(100vh-73px-69px)] w-full">
      {messages.map((message, idx) =>
        !message.isVote ? (
          <MessageBox
            key={`message-${conversationId}-${idx}`}
            isLast={idx === messages.length - 1}
            data={message}
          />
        ) : (
          !isVote && (
            <VoteBox
              key={`message-${conversationId}-${idx}`}
              isLast={idx === messages.length - 1}
              message={message}
            />
          )
        ),
      )}
      <div ref={bottomRef} className="w-full pt-px" />
    </ScrollArea>
  );
};

export default ConversationBody;
