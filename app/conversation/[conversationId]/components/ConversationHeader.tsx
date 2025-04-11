"use client";

import {
  ChevronLeft,
  EllipsisIcon,
  LogOut,
  UserPlus,
  Users,
} from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/app/hooks/useModalStore";
import { FullConversationType } from "@/app/types";
import { cn } from "@/lib/utils";

interface ConversationHeaderProps {
  conversation: FullConversationType,
  inVote?: boolean
}

const ConversationHeader = ({ conversation, inVote = false }: ConversationHeaderProps) => {
  const { onOpen } = useModal();

  const statusText = useMemo(() => {
    return `${conversation?.users.length} members`;
  }, [conversation?.users]);

  return (
    <div className="flex w-full items-center justify-between border-b-[1px] bg-white px-4 py-3 shadow-sm sm:px-5 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="block cursor-pointer shadow lg:hidden"
        >
          <Link href="/conversation">
            <ChevronLeft className="h-auto w-8" />
          </Link>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={cn("block cursor-pointer shadow ", !inVote && "hidden")}
        >
          <Link href={`/conversation/${conversation?.id}`} className="flex justify-center">
            <ChevronLeft className="h-auto w-8" />
          </Link>
        </Button>

        <Avatar className="h-auto w-12 border drop-shadow-md">
          <AvatarImage src="https://images.freeimages.com/images/large-previews/962/avatar-man-with-mustages-1632966.jpg?fmt=webp&h=350" />
          <AvatarFallback>{conversation?.name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="font-medium text-gray-900">{conversation?.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>

<div>
  <Button onClick={() => onOpen("invite", { conversation })} variant={"outline"} className="cursor-pointer px-3 py-2 text-sm mr-2">
    <UserPlus/> Invite other people</Button>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <EllipsisIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-mediumspace-y-[2px] w-56 text-xs">
          <DropdownMenuLabel className="px-3 py-2">
            Conversation Options
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onOpen("invite", { conversation })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Invite People <UserPlus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpen("members", { conversation })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Members List <Users className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onOpen("leaveGroup", { conversation })}
            className="cursor-pointer px-3 py-2 text-sm text-rose-500"
          >
            Leave Chat <LogOut className="ml-auto h-4 w-4 text-rose-500" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </div>
  );
};

export default ConversationHeader;
