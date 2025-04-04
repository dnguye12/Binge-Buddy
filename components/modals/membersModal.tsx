import { useModal } from "@/app/hooks/useModalStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

export const MembersModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { conversation } = data;

  const isModalOpen = isOpen && type === "members";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Members List
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {conversation?.users.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] px-6">
          {conversation?.users?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <Avatar>
                <AvatarImage src={member.image} />
                <AvatarFallback>{member.name}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center text-sm font-semibold">
                  {member.name}
                </div>
                <p className="text-xs text-zinc-500">{member.email}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
