import { FullMessageType } from "@/app/types";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns";
import Image from "next/image";

interface MessageBoxProps {
    isLast: boolean,
    data: FullMessageType
}
const MessageBox = ({ isLast, data }: MessageBoxProps) => {
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
        "text-sm w-fit overflow-hidden",
        isOwn ? "bg-black text-white" : "bg-gray-100",
        data.image ? "rounded-md p-0 bg-transparent drop-shadow-md" : "rounded-full py-2 px-3"
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
                <div className={message}>
                    {data.image
                        ? (
                            <Image
                                alt="image"
                                height={144}
                                width={144}
                                src={data.image}
                                className="object-hover cursor-pointer hover:scale-110 transition translate"
                            />
                        )
                        :
                        (
                            <div>{data.body}</div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default MessageBox;