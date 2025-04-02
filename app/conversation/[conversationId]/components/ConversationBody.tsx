"use client"

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import VoteBox from "./VoteBox";

interface ConversationBodyProps {
  initialMessages: FullMessageType[]
}
const ConversationBody = ({ initialMessages }: ConversationBodyProps) => {
  const [messages, setMessages] = useState(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { conversationId } = useConversation()

  useEffect(() => {
    axios.post(`/api/conversation/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversation/${conversationId}/seen`)
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current
        }

        return [...current, message]
      })
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage
        }

        return currentMessage
      }))
    }

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind("messages:update", updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind("messages:new", messageHandler)
      pusherClient.unbind("messages:update", updateMessageHandler)
    }
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto relative">
      {
        messages.map((message, idx) => (

          !message.isVote ? (
            <MessageBox
              key={`message-${conversationId}-${idx}`}
              isLast={idx === messages.length - 1}
              data={message}
            />
          )
            :
            (
              <VoteBox
                key={`message-${conversationId}-${idx}`}
                isLast={idx === messages.length - 1}
                data={message}
              />
            )
        ))
      }
      <div ref={bottomRef} className="pt-px absolute w-full bottom-[-69px] left-0" />
    </div>
  )
};

export default ConversationBody;
