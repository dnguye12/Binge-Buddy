"use client"

import { Conversation } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ConversationBoxProps {
    conversation: Conversation
}

const ConversationBox = ({ conversation }: ConversationBoxProps) => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)

    const handleClick = useCallback(() => {
        setIsLoading(true)

        axios.post('/api/conversations', {
            id: conversation.id
        })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`)
            })
            .finally(() => setIsLoading(false))
    }, [conversation, router])

    return (
        <div onClick={handleClick}
            className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer">
            <div className="relative">
                <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3 z-10"></span>
                <Avatar className="w-12 h-auto drop-shadow-md border">
                    <AvatarImage src="https://images.freeimages.com/images/large-previews/962/avatar-man-with-mustages-1632966.jpg?fmt=webp&h=350" />
                    <AvatarFallback>{conversation.name}</AvatarFallback>
                </Avatar>
            </div>
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-900">{conversation.name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationBox;