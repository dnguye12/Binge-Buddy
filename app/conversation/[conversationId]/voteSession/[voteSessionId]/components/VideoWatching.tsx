"use client"

import { FullVoteSessionType } from "@/app/types";
import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/file"

interface VideoWatchingProps {
    voteSession: FullVoteSessionType,
    voteSessionId: string,
    isOwn: boolean
}
const VideoWatching = ({ voteSession, voteSessionId, isOwn }: VideoWatchingProps) => {
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        pusherClient.subscribe(voteSessionId)

        const handleClick = (pause: boolean) => {
            setPlaying(!pause)
        }

        pusherClient.bind("voteSession_watching:status", handleClick)

        return () => {
            pusherClient.unsubscribe(voteSessionId)
            pusherClient.unbind("voteSession_watching:status", handleClick)
        }
    }, [voteSessionId])

    const onClickPause = async (pause: boolean) => {
        await axios.post(`/api/conversation/${voteSession?.conversationId}/voteSession/${voteSession?.id}/watching`,
            { pause }
        )
    }

    const onEndMovie = async () => {
        await axios.patch(`/api/conversation/${voteSession?.conversationId}/voteSession/${voteSession?.id}/next-vote`, { movies: [] })
    }

    return (
        <div className="flex-1 overflow-y-auto relative w-2/3">
            <div className="flex flex-col gap-6 py-6 h-[calc(100vh-73px)]">
                <ReactPlayer
                    url={"/videos/drake.mp4"}
                    playing={playing}
                    controls={true}
                    volume={0}
                    width={"100%"}
                    height={"100%"}
                    onPause={() => { onClickPause(true) }}
                    onPlay={() => { onClickPause(false) }}
                />
                <div className="flex justify-end px-6">
                    {
                        isOwn
                            ?
                            (
                                <Button onClick={onEndMovie} size={"lg"}>End Movie Now.</Button>
                            )
                            :
                            (
                                <Button disabled variant={"ghost"} size={"lg"}></Button>
                            )
                    }
                </div>
            </div>

        </div>
    );
}

export default VideoWatching;