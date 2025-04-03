"use client"

import { FullConversationType, FullMessageType, FullVoteSessionType } from "@/app/types"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { redirect, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ConversationHeader from "../../components/ConversationHeader"
import SetOptions from "./components/SetOptions"
import SetOptionsOther from "./components/SetOptionsOther"
import { pusherClient } from "@/lib/pusher"
import VoteRound from "./components/VoteRound"
import ConversationBody from "../../components/ConversationBody"
import ConversationForm from "../../components/ConversationForm"

const VoteSessionIdPage = () => {
    const { conversationId, voteSessionId } = useParams<{
        conversationId: string,
        voteSessionId: string
    }>()
    const { user } = useUser()

    const [voteSession, setVoteSession] = useState<FullVoteSessionType>(null)
    const [conversation, setConversation] = useState<FullConversationType>(null)
    const [voteMembers, setVoteMembers] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState<FullMessageType[]>([])

    const isOwn = user?.id === voteSession?.sender.clerkId

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await axios.get(`/api/conversation/${conversationId}/voteSession/${voteSessionId}`)
                if (data) {
                    setVoteSession(data.data)
                } else {
                    redirect(`/conversation/${conversationId}`)
                }

                const isIn = voteSession?.members.filter((member) => member.clerkId === user?.id)

                if (voteSession?.status !== "INITIATED" && voteSession?.status !== "ROUND_ONE" && isIn?.length === 0) {
                    redirect(`/conversation/${conversationId}`)
                }

                const data1 = await axios.get(`/api/conversation/${conversationId}`)
                if (data1) {
                    setConversation(data1.data)
                } else {
                    redirect(`/conversation/${conversationId}`)
                }

                const data2 = await axios.get(`/api/conversation/${conversationId}/messages`)
                if (data2) {
                    setMessages(data2.data)
                } else {
                    redirect(`/conversation/${conversationId}`)
                }

                await axios.patch(`/api/conversation/${conversationId}/voteSession/${voteSessionId}/join-vote`)
            } catch (error) {
                console.log(error)
                redirect(`/conversation/${conversationId}`)
            } finally {
                setLoading(false)
            }
        }

        if (loading && conversationId && voteSessionId) {
            fetchData()
        }
    }, [loading, conversationId, voteSessionId, user, voteSession])

    useEffect(() => {
        pusherClient.subscribe(voteSessionId)

        const updateStatus = (updatedVoteSession: FullVoteSessionType) => {
            setVoteSession(updatedVoteSession)
        }

        const memberJoin = (updatedVoteSession: FullVoteSessionType) => {
            setVoteMembers(updatedVoteSession?.members?.map((member) => (member.clerkId)) ?? [])
        }

        const nextVote = (helper: number) => {
            if (helper === -1) {
                setVoteSession(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        status: "ROUND_TWO"
                    };
                });
            } else {
                setVoteSession(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        status: "FINISHED"
                    };
                });
            }
        }

        pusherClient.bind("voteSession_status:update", updateStatus)
        pusherClient.bind("voteSession_join:new", memberJoin)
        pusherClient.bind("voteSession_round_one:end", nextVote)

        return () => {
            pusherClient.unsubscribe(voteSessionId)
            pusherClient.unbind("voteSession_status:update", updateStatus)
            pusherClient.unbind("voteSession_join:new", memberJoin)
            pusherClient.unbind("voteSession_round_one:end", nextVote)
        }
    }, [voteSessionId])

    if (loading) {
        return <div className="h-full lg:pl-80">...Loading</div>
    }

    return (
        <div className="h-full lg:pl-80">
            <div className="flex h-screen overflow-hidden flex-col">
                <ConversationHeader conversation={conversation} />
                <div className="flex">
                    {
                        voteSession?.status === "INITIATED"
                        &&
                        (isOwn
                            ?
                            (
                                <SetOptions conversationId={conversationId} voteSessionId={voteSessionId} />
                            )
                            :
                            (
                                <SetOptionsOther name={voteSession.sender.name} />
                            )
                        )
                    }
                    {
                        (voteSession?.status === "ROUND_ONE" || voteSession?.status === "ROUND_TWO")
                        &&
                        (
                            <VoteRound voteSession={voteSession} voteMembers={voteMembers} />
                        )
                    }
                    {
                        voteSession?.status === "FINISHED"
                        && 
                        (
<></>
                        )
                    }
                    <div className="w-1/3 border-l">
                        <ConversationBody initialMessages={messages} isVote={true} />
                        <ConversationForm isVote={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VoteSessionIdPage;