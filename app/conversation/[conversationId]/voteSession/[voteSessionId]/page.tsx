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
import VoteBeforeWatching from "./components/VoteBeforeWatching"
import BeforeVoting from "./components/BeforeVoting"
import VideoWatching from "./components/VideoWatching"



const VoteSessionIdPage = () => {
    const { conversationId, voteSessionId } = useParams<{
        conversationId: string,
        voteSessionId: string
    }>()
    const { user } = useUser()

    const [voteSession, setVoteSession] = useState<FullVoteSessionType>(null)
    const [conversation, setConversation] = useState<FullConversationType>(null)
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

        const nextVote = (updatedVoteSession: FullVoteSessionType) => {
            setVoteSession(updatedVoteSession);
        }

        const memberJoin = (updatedVoteSession: FullVoteSessionType) => {
            setVoteSession(updatedVoteSession)
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const endVote = (winnerIdx: number) => {
            setVoteSession(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    status: "BEFORE_WATCHING"
                }
            })
        }

        pusherClient.bind("voteSession_status:update", updateStatus)
        pusherClient.bind("voteSession_join:new", memberJoin)
        pusherClient.bind("voteSession_round_one:end", nextVote)
        pusherClient.bind("voteSession_round_two:end", endVote)

        return () => {
            pusherClient.unsubscribe(voteSessionId)
            pusherClient.unbind("voteSession_status:update", updateStatus)
            pusherClient.unbind("voteSession_join:new", memberJoin)
            pusherClient.unbind("voteSession_round_one:end", nextVote)
            pusherClient.unbind("voteSession_round_two:end", endVote)
        }
    }, [voteSessionId])

    if (loading) {
        return <div className="h-full lg:pl-80">...Loading</div>
    }

    if (!loading && !voteSession) {
        redirect(`/conversation/${conversationId}`)
    }

    if (!loading && voteSession?.status === "FINISHED") {
        redirect(`/conversation/${conversationId}`)
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
                        voteSession?.status === "BEFORE_VOTING"
                        &&
                        <BeforeVoting voteSession={voteSession} />
                    }
                    {
                        (voteSession?.status === "ROUND_ONE" || voteSession?.status === "ROUND_TWO")
                        &&
                        (
                            <VoteRound voteSession={voteSession} />
                        )
                    }
                    {
                        voteSession?.status === "BEFORE_WATCHING"
                        &&
                        (
                            <VoteBeforeWatching voteSession={voteSession} voteSessionId={voteSessionId} user={user} />
                        )
                    }
                    {
                        voteSession?.status === "WATCHING"
                        &&
                        (
                            <VideoWatching voteSession={voteSession} voteSessionId={voteSessionId} isOwn={isOwn} />
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