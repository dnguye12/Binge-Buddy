"use client"

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { FullConversationType } from "@/app/types";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";

interface ConversationBoxProps {
    conversation: FullConversationType,
    selected: boolean
}

const ConversationBox = ({ conversation, selected }: ConversationBoxProps) => {
    const router = useRouter()
    const { user } = useUser()

    const [isLoading, setIsLoading] = useState(false)

    const handleClick = useCallback(() => {
        setIsLoading(true)

        router.push(`/conversation/${conversation.id}`)
    }, [conversation.id, router])

    const lastMessage = useMemo(() => {
        const messages = conversation.messages || []

        return messages[messages.length - 1]
    }, [conversation.messages])

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false
        }

        const seenArray = lastMessage.seen || []

        return seenArray.filter((seenUser) => seenUser.clerkId === user?.id).length !== 0
    }, [lastMessage, user?.id])

    const lastMessageText = useMemo(() => {
        //Check if image later

        if (lastMessage?.body) {
            return lastMessage.body
        }

        return "Started a conversation"
    }, [lastMessage])

    return (
        <div onClick={handleClick}
            className={cn(
                "w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer",
                selected ? "bg-neutral-100" : "bg-white"
            )} >
            <div className="relative">
                <Avatar className="w-12 h-auto drop-shadow-md border">
                    <AvatarImage src="https://images.freeimages.com/images/large-previews/962/avatar-man-with-mustages-1632966.jpg?fmt=webp&h=350" />
                    <AvatarFallback>{conversation.name}</AvatarFallback>
                </Avatar>
            </div>
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-900">{conversation.name}</p>
                        {lastMessage?.createdAt && (
                            <p className="text-xs text-gray-400 font-light">
                                {format(new Date(lastMessage.createdAt), "p")}
                            </p>
                        )}
                    </div>
                    <p className={cn(
                        "truncate text-sm",
                        hasSeen ? "text-gray-500" : "text-black font-medium"
                    )}>{lastMessageText}</p>
                </div>
            </div>
        </div>
    );
}

export default ConversationBox;