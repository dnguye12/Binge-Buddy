"use client"

import { Conversation, User } from "@prisma/client";
import { ChevronLeft, EllipsisIcon, LogOut, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModal } from "@/app/hooks/useModalStore";


interface ConversationHeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const ConversationHeader = ({ conversation }: ConversationHeaderProps) => {
  const { onOpen } = useModal()
  
  const statusText = useMemo(() => {
    return `${conversation.users.length} members`;
  }, [conversation.users]);

  return (
    <div className="flex w-full items-center justify-between border-b-[1px] bg-white px-4 py-3 shadow-sm sm:px-5 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="cursor-pointer shadow block lg:hidden">
          <Link href="/conversation">
            <ChevronLeft className="h-auto w-8" />
          </Link>
        </Button>

        <Avatar className="h-auto w-12 border drop-shadow-md">
          <AvatarImage src="https://images.freeimages.com/images/large-previews/962/avatar-man-with-mustages-1632966.jpg?fmt=webp&h=350" />
          <AvatarFallback>{conversation.name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="font-medium text-gray-900">{conversation.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>


      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon" className="cursor-pointer shadow">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 text-xs font-mediumspace-y-[2px]">
          <DropdownMenuLabel className="px-3 py-2">Conversation Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onOpen("invite", {conversation})} className="px-3 py-2 text-sm cursor-pointer">Invite People <UserPlus className="h-4 w-4 ml-auto" /></DropdownMenuItem>
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">See Members <Users className="w-4 h-4 ml-auto" /></DropdownMenuItem>
          <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-rose-500">Leave Chat <LogOut className="h-4 w-4 ml-auto text-rose-500" /></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
};

export default ConversationHeader;
