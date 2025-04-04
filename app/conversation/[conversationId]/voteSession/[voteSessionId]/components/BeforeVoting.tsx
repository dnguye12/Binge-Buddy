import { FullVoteSessionType } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator"

interface BeforeVotingProps {
    voteSession: FullVoteSessionType
}

const BeforeVoting = ({ voteSession }: BeforeVotingProps) => {
    const { user } = useUser()
    const alreadyMember = (voteSession?.members ?? [])
        .filter((mem) => mem.user?.clerkId === user?.id)
        .length > 0;
    let role = "Spectator"
    if (alreadyMember) {
        role = voteSession?.members.filter((mem) => mem.user?.clerkId === user?.id)[0].isVoter ? "Voter" : "Spectator"
    }

    const isOwn = voteSession?.sender.clerkId === user?.id

    const handleJoin = async (isVoter: boolean) => {
        await axios.patch(`/api/conversation/${voteSession?.conversationId}/voteSession/${voteSession?.id}/join-vote`,
            {
                isVoter
            }
        )
    }

    const handleSubmit = async () => {
        await axios.patch(`/api/conversation/${voteSession?.conversationId}/voteSession/${voteSession?.id}/next-vote`, {movies: []})
    }

    return (
        <div className="flex-1 overflow-y-auto relative w-2/3 px-8">
            <div className="flex flex-col py-12 gap-4 h-[calc(100vh-73px)]">
                <h1 className="text-center text-2xl font-semibold">{voteSession?.sender.name} started a vote session.</h1>
                {
                    alreadyMember
                        ?
                        <p className="text-center text-lg">You have become a <span className="font-semibold">{role}</span></p>
                        :
                        <p className="text-center text-lg">Would you like to join or just waiting?</p>
                }


                <div className="flex justify-center gap-4">
                    <Button
                        disabled={alreadyMember && role === "Spectator"}
                        onClick={() => { handleJoin(false) }}
                        size={"lg"}
                        variant={"secondary"}
                        className="shadow-md">Spectator</Button>
                    <Button
                        disabled={alreadyMember && role === "Voter"}
                        onClick={() => { handleJoin(true) }}
                        size={"lg"}
                        variant={"default"}
                        className="shadow-md">Voter</Button>
                </div>

                <div className="flex justify-center mb-8">
                    {
                        isOwn ?
                            <Button onClick={handleSubmit} variant={"default"} size={"lg"} className="text-lg py-6 shadow-md">
                                Start Round One <ChevronRight />
                            </Button>
                            :
                            (
                                <div className="h-12 w-[208px] rounded-md shadow-md flex justify-center items-center bg-secondary text-lg">
                                    Waiting for others...
                                </div>
                            )
                    }
                </div>
                <Separator />
                <p className="text-center text-xl font-semibold mt-8">{voteSession?.members?.length} members</p>
                <div className="grid grid-cols-2 gap-6 container max-w-xl mx-auto">
                    {
                        voteSession?.members?.map((member, idx) => (
                            <div key={`vote before member ${idx}`} className="flex items-center shadow-md bg-secondary rounded-md border">
                                <div className="border-r p-4">
                                    <Image
                                        src={member.user.image}
                                        width={48}
                                        height={48}
                                        alt=""
                                        className="rounded-full drop-shadow-md"
                                    />
                                </div>
                                <div className="p-4 flex flex-col items-start text-secondary-foreground">
                                    <p>{member.user.name}</p>
                                    <p className="font-semibold">{member.isVoter ? "Voter" : "Spectator"}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default BeforeVoting;