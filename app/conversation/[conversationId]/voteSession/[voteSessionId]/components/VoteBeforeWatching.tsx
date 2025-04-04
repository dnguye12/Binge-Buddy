"use client";

import { FullVoteSessionType, TMDBMovie } from "@/app/types";
import { Button } from "@/components/ui/button";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import { format } from "date-fns";
import { CheckIcon, ChevronRightIcon, CircleXIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface VoteBeforeWatchingProps {
  voteSession: FullVoteSessionType;
  voteSessionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

const VoteBeforeWatching = ({
  voteSession,
  voteSessionId,
  user,
}: VoteBeforeWatchingProps) => {
  const [movie, setMovie] = useState<TMDBMovie>(null);
  const [readyCount, setReadyCount] = useState(voteSession?.ready.length);
  const [readyMode, setReadyMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await axios.get(`/api/movie/${voteSession?.winnerId}`);
        if (res) {
          setMovie(res.data);
        }
      };

      if (loading && voteSession?.winnerId) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [loading, voteSession?.winnerId]);

  useEffect(() => {
    const updateReady = (updatedReady: string[]) => {
      setReadyCount(updatedReady.length);
      setReadyMode(updatedReady.some((r) => r == user.id));
    };
    pusherClient.subscribe(voteSessionId);
    pusherClient.bind("voteSession_join_watch:patch", updateReady);

    return () => {
      pusherClient.unsubscribe(voteSessionId);
      pusherClient.unbind("voteSession_join_watch:patch", updateReady);
    };
  }, [voteSessionId, user.id]);

  const onReady = async () => {
    await axios.patch(
      `/api/conversation/${voteSession?.conversationId}/voteSession/${voteSession?.id}/join-watch`,
    );
  };

  const handleSubmit = async () => {
    await axios.patch(
      `/api/conversation/${voteSession?.conversationId}/voteSession/${voteSession?.id}/next-vote`,
      { movies: [] },
    );
  };

  if (loading || !movie) {
    return (
      <div className="relative w-2/3 flex-1 overflow-y-auto">
        <div className="flex h-[calc(100vh-73px)] flex-col gap-6 py-6">
          ...Loading
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-2/3 flex-1 overflow-y-auto">
      <div className="flex h-[calc(100vh-73px)] flex-col gap-6 py-6">
        <h1 className="text-center text-2xl font-semibold">
          {movie?.title} won!
        </h1>

        <div className="grid flex-1 grid-cols-2 gap-6 px-6">
          <div
            className="relative h-full w-full rounded-md rounded-t-md border bg-cover bg-center bg-no-repeat shadow-md"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.poster_path})`,
            }}
          ></div>
          <div className="py-4">
            <p>Title: {movie.title}</p>
            <p>Overview: {movie.overview}</p>
            <p>Score: {movie.vote_average.toFixed(2)}/10</p>
            <p>Total votes: {movie.vote_count}</p>
            <p>
              Release date:{" "}
              {format(new Date(movie.release_date), "do MMMM yyyy")}
            </p>
          </div>
        </div>

        <div className="flex justify-between px-6">
          <div className="flex h-10 items-center justify-center rounded-md border px-4 shadow-md">
            {readyCount} people ready!
          </div>
          <div className="flex gap-2">
            {readyMode ? (
              <Button
                onClick={() => {
                  onReady();
                }}
                variant={"destructive"}
                size={"lg"}
                className="shadow-md"
              >
                <CircleXIcon /> Unready
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onReady();
                }}
                variant={"secondary"}
                size={"lg"}
                className="shadow-md"
              >
                <CheckIcon /> Ready
              </Button>
            )}
            {voteSession?.sender.clerkId === user.id && (
              <Button onClick={handleSubmit} size={"lg"} className="shadow-md">
                Start Watching
                <ChevronRightIcon />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteBeforeWatching;
