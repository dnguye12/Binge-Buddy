"use client"

import { Conversation } from "@prisma/client";

import ConversationBox from "./ConversationBox";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useModal } from "@/app/hooks/useModalStore";


interface ConversationListProps {
    conversations: Conversation[]
}

const ConversationList = ({ conversations }: ConversationListProps) => {
    const { onOpen } = useModal()

    return (
        <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0">
            <div className="px-5">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-neutral-800 py-4">Groups</div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    onClick={() => onOpen("createGroup")}
                                    variant="outline"
                                    size="icon"
                                    className="cursor-pointer shadow-md"
                                >
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Add a new group</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                </div>
                {conversations.map((conversation) => (
                    <ConversationBox key={conversation.id} conversation={conversation} />
                ))}
            </div>
        </aside>
    );
}

export default ConversationList;