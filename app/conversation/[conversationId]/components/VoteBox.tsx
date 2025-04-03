"use client"

import { FullMessageType } from "@/app/types";
import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { VoteIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface VoteBoxProps {
    isLast: boolean,
    message: FullMessageType
}
const VoteBox = ({ isLast, message }: VoteBoxProps) => {
    const { user } = useUser()
    const router = useRouter()

    const isOwn = user?.id === message.sender.clerkId
    const seenList = (message.seen || [])
        .filter((seenUser) => seenUser.clerkId !== message.sender.clerkId)
        .map((seenUser) => seenUser.name)
        .join(', ')

    const container = cn(
        "flex gap-3 p-4",
        isOwn && "justify-end"
    )
    const avatar = cn(isOwn && "order-2")
    const body = cn(
        "flex flex-col gap-2",
        isOwn && "items-end"
    )
    const messageClass = cn(
        "text-lg shadow-xs transition-all w-fit overflow-hidden p-6 rounded-md cursor-pointer flex items-center gap-2",
        isOwn ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    )

    const handleGoToVote = () => {
        router.push(`/conversation/${message.conversationId}/voteSession/${message.voteSessionId}`)
    }

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar>
                    <AvatarImage src={message.sender.image} />
                    <AvatarFallback>{message.sender.name}</AvatarFallback>
                </Avatar>
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {message.sender.name}
                    </div>
                    <div className="text-sm text-gray-400">
                        {format(new Date(message.createdAt), 'p')}
                    </div>
                </div>
                <button 
                disabled={message.voteSession?.status !== "INITIATED" && message.voteSession?.status !== "ROUND_ONE"} 
                onClick={() => {handleGoToVote()}} 
                className={messageClass}>
                    {
                        isOwn
                            ?
                            (

                                <>
                                    <VoteIcon className="w-9 h-auto" />
                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-base font-semibold leading-none tracking-tight">You started a vote</p>
                                        <p className="text-sm text-muted-foreground text-center mt-1">Join the session now.</p>
                                    </div>
                                </>
                            )
                            :
                            (
                                <>
                                    <VoteIcon className="w-9 h-auto" />
                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-base font-semibold leading-none tracking-tight">{message.sender.name} started a vote</p>
                                        <p className="text-sm text-secondary-foreground text-center mt-1">Join the session now.</p>
                                    </div>
                                </>
                            )
                    }
                </button>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-gray-500">
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div >

    );
}

export default VoteBox;