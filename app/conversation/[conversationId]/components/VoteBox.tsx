"use client"

import { FullMessageType } from "@/app/types";
import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CircleXIcon, TvMinimalPlayIcon, VoteIcon } from "lucide-react";
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
        "text-lg shadow-xs transition-all w-fit overflow-hidden p-6 rounded-md cursor-pointer flex items-center gap-2 disabled:pointer-events-none disabled:opacity-50",
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
                {
                    (message.voteSession?.status === "INITIATED" || message.voteSession?.status === "BEFORE_VOTING")
                        ? (
                            <button
                                onClick={() => { handleGoToVote() }}
                                className={messageClass}>
                                {
                                    isOwn
                                        ?
                                        (

                                            <>
                                                <VoteIcon className="w-9 h-auto" />
                                                <div className="flex flex-col items-start justify-center">
                                                    <p className="text-base font-semibold leading-none tracking-tight">You started a vote</p>
                                                    <p className="text-sm text-primary-foreground text-center mt-1">Join the session now.</p>
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
                        )
                        : message.voteSession?.status === "BEFORE_WATCHING"
                            ?
                            (
                                <button onClick={() => { handleGoToVote() }} className={messageClass}>
                                    <TvMinimalPlayIcon className="w-9 h-auto" />
                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-base font-semibold leading-none tracking-tight">Movie is playing.</p>
                                        <p className={cn("text-sm text-center mt-1", isOwn ? "text-primary-foreground" : "text-secondary-foreground")}>Join them.</p>
                                    </div>
                                </button>
                            )
                            : (message.voteSession?.status === "ROUND_ONE" || message.voteSession?.status === "ROUND_TWO")
                                ?
                                (
                                    <button onClick={() => { handleGoToVote() }} className={messageClass}>
                                        <VoteIcon className="w-9 h-auto" />
                                        <div className="flex flex-col items-start justify-center">
                                            <p className="text-base font-semibold leading-none tracking-tight">Voting in process.</p>
                                            <p className={cn("text-sm text-center mt-1", isOwn ? "text-primary-foreground" : "text-secondary-foreground")}>Spectate the vote.</p>
                                        </div>
                                    </button>
                                )
                                :
                                (
                                    <button disabled={true} className={messageClass}>
                                        <CircleXIcon className="w-9 h-auto" />
                                        <div className="flex flex-col items-start justify-center">
                                            <p className="text-base font-semibold leading-none tracking-tight">Vote link expired</p>
                                            <p className={cn("text-sm text-center mt-1", isOwn ? "text-primary-foreground" : "text-secondary-foreground")}>Too late, LOSER</p>
                                        </div>
                                    </button>
                                )
                }

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