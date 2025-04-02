"use client"

import { FullConversationType, FullVoteSessionType } from "@/app/types"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { redirect, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ConversationHeader from "../../components/ConversationHeader"
import SetOptions from "./components/SetOptions"
import SetOptionsOther from "./components/SetOptionsOther"
import { pusherClient } from "@/lib/pusher"
import VoteRound from "./components/VoteRound"

const VoteSessionIdPage = () => {
    const { conversationId, voteSessionId } = useParams<{
        conversationId: string,
        voteSessionId: string
    }>()
    const { user } = useUser()

    const [voteSession, setVoteSession] = useState<FullVoteSessionType>(null)
    const [conversation, setConversation] = useState<FullConversationType>(null)
    const [loading, setLoading] = useState(true)

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

                const data1 = await axios.get(`/api/conversation/${conversationId}`)
                if (data1) {
                    setConversation(data1.data)
                } else {
                    redirect(`/conversation/${conversationId}`)
                }
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
    }, [loading, conversationId, voteSessionId])

    useEffect(() => {
        pusherClient.subscribe(voteSessionId)

        const updateStatus = (updatedVoteSession: FullVoteSessionType) => {
            setVoteSession(updatedVoteSession)
        }

        pusherClient.bind("voteSession_status:update", updateStatus)

        return () => {
            pusherClient.unsubscribe(voteSessionId)
            pusherClient.unbind("voteSession_status:update", updateStatus)
        }
    }, [voteSessionId])

    if (loading) {
        return <div className="h-full lg:pl-80">...Loading</div>
    }

    return (
        <div className="h-full lg:pl-80">
            <div className="flex h-full min-h-screen flex-col">
                <ConversationHeader conversation={conversation} />
                <div className="flex ">
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
                        voteSession?.status === "ROUND_ONE"
                        &&
                        (
                            <VoteRound />
                        )
                    }
                    <div className="w-1/3 border-l">dqsdsqd</div>
                </div>
            </div>
        </div>
    );
}

export default VoteSessionIdPage;