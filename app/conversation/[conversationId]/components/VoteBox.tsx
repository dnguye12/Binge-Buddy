import { FullMessageType } from "@/app/types";
import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { VoteIcon } from "lucide-react";

interface VoteBoxProps {
    isLast: boolean,
    data: FullMessageType
}
const VoteBox = ({ isLast, data }: VoteBoxProps) => {
    console.log(data)
    const { user } = useUser()

    const isOwn = user?.id === data.sender.clerkId
    const seenList = (data.seen || [])
        .filter((seenUser) => seenUser.clerkId !== data.sender.clerkId)
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
    const message = cn(
        "text-lg shadow-xs transition-all w-fit overflow-hidden p-6 rounded-md cursor-pointer flex items-center gap-2",
        isOwn ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    )

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar>
                    <AvatarImage src={data.sender.image} />
                    <AvatarFallback>{data.sender.name}</AvatarFallback>
                </Avatar>
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-sm text-gray-400">
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <button className={message}>
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
                                        <p className="text-base font-semibold leading-none tracking-tight">{data.sender.name} started a vote</p>
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