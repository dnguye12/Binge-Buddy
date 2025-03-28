"use client"

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";

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

  return (
    <div className="flex-1 overflow-y-auto">
      {
        messages.map((message, idx) => (
          <MessageBox
            key={`message-${conversationId}-${idx}`}
            isLast={idx === messages.length - 1}
            data={message}
          />
        ))
      }
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
};

export default ConversationBody;
