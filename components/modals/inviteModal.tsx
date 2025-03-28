import { useModal } from "@/app/hooks/useModalStore";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { useOrigin } from "@/app/hooks/useOrigin";
import axios from "axios";

const InviteModal = () => {
    const { isOpen, onOpen, onClose, type, data } = useModal()
    const origin = useOrigin()
    const { conversation } = data

    const isModalOpen = isOpen && type === "invite"

    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const inviteUrl = `${origin}/invite/${conversation?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const onNewInviteLink = async () => {
        try {
            setIsLoading(true)
            const res = await axios.patch(`/api/conversation/${conversation?.id}/invite-code`)
            onOpen("invite", { conversation: res.data })
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server invite link</Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button disabled={isLoading} onClick={onCopy} size={"icon"} className="cursor-pointer drop-shadow-md">
                            {
                                copied
                                    ? <Check className="w-4 h-4" />
                                    : <Copy className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                    <Button
                        variant={"outline"}
                        disabled={isLoading}
                        onClick={onNewInviteLink}
                        size={"sm"}
                        className="text-xs mt-4 cursor-pointer drops-shadow-md"
                    >Generate a new link<RefreshCcw className="w-4 h-4 ml-2" /></Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default InviteModal;