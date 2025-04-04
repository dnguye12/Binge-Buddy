"use client";

import { FullVoteSessionType, TMDBMovie } from "@/app/types";
import axios from "axios";
import { useEffect, useState } from "react";
import VoteBox from "./VoteBox";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, CircleXIcon, ThumbsDownIcon } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface VoteRoundProp {
  voteSession: FullVoteSessionType;
}

const VoteRound = ({ voteSession }: VoteRoundProp) => {
  const { user } = useUser();
  const round = voteSession?.status === "ROUND_ONE" ? 1 : 2;
  const isIn = (voteSession?.members ?? []).some(
    (member) => member.user.clerkId === user?.id,
  );
  const isVoter = isIn
    ? voteSession?.members.find((member) => member.user.clerkId === user?.id)
        ?.isVoter
    : false;

  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [votes, setVotes] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [voteCount, setVoteCount] = useState(
    voteSession?.voteSessionVotes?.filter((v) => v.round === round).length || 0,
  );

  //-2 not used, -1 using, otherwise index of super disliked item
  const [superD, setSuperD] = useState(-2);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const options = {
          method: "GET",
          url: "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=35%7C28",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_KEY}`,
          },
        };

        const res = await axios.request(options);
        if (res) {
          const movieSlice = res.data.results.slice(0, 6);
          setMovies(movieSlice);
          setVotes(new Array(movieSlice.length).fill(false));
        }
      };

      if (loading) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [loading, movies.length]);

  useEffect(() => {
    if (voteSession) {
      pusherClient.subscribe(voteSession.id);

      const voteHandler = async () => {
        const oldCount = voteCount;
        await setVoteCount(voteCount + 1);

        if (
          oldCount + 1 >=
          voteSession?.members.filter((member) => member.isVoter).length
        ) {
          await axios.patch(
            `/api/conversation/${voteSession?.conversationId}/voteSession/${voteSession?.id}/next-vote`,
            {
              movies,
            },
          );
        }
      };

      pusherClient.bind("voteSession_vote:new", voteHandler);

      return () => {
        pusherClient.unsubscribe(voteSession.id);
        pusherClient.unbind("voteSession_vote:new", voteHandler);
      };
    }
  }, [voteSession, voteCount, movies]);

  useEffect(() => {
    if (voteSession) {
      pusherClient.subscribe(voteSession.id);

      const nextVote = (helper: number) => {
        if (helper === -1) {
          setVotes(new Array(movies.length).fill(false));
          setSubmitted(false);
          setVoteCount(0);
          setSuperD(-2);
        }
      };

      pusherClient.bind("voteSession_round_one:end", nextVote);

      return () => {
        pusherClient.unsubscribe(voteSession.id);
        pusherClient.unbind("voteSession_round_one:end", nextVote);
      };
    }
  });

  const voteMovie = (idx: number) => {
    setVotes((prev) => {
      const updatedVotes = [...prev];
      updatedVotes[idx] = !prev[idx];
      return updatedVotes;
    });
  };

  const superDislikeMovie = (idx: number) => {
    if (superD === -1) {
      setSuperD(idx);
    } else if (superD === idx) {
      setSuperD(-2);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await axios.post(
      `/api/conversation/${voteSession?.conversationId}/voteSession/${voteSession?.id}/vote`,
      {
        round,
        votes,
        superD,
      },
    );
  };

  return (
    <div className="relative w-2/3 flex-1 overflow-y-auto">
      <div className="flex h-[calc(100vh-73px)] flex-col gap-6 py-6">
        {isIn ? (
          <>
            <h1 className="text-center text-2xl font-semibold">
              {submitted ? "You already voted, wait for others..." : "Vote!"}
            </h1>
            <div className="grid flex-1 grid-cols-3 gap-x-8 gap-y-4 px-6">
              {movies.map((movie, idx) => (
                <VoteBox
                  key={`movie-round-1-${idx}`}
                  idx={idx}
                  movie={movie}
                  myVote={votes[idx]}
                  voteMovie={voteMovie}
                  superD={superD}
                  superDislikeMovie={superDislikeMovie}
                  submitted={submitted}
                  isVoter={isVoter ?? false}
                />
              ))}
            </div>
            <div className="flex justify-between px-6">
              <p className="text-xl font-semibold">Round {round}/2</p>
              <div className="flex items-center gap-x-2">
                <p className="mr-4 font-semibold uppercase">
                  {voteCount}/
                  {
                    voteSession?.members.filter((member) => member.isVoter)
                      .length
                  }{" "}
                  voted
                </p>
                {round === 1 && (
                  <Button
                    onClick={() => {
                      if (superD === -2) {
                        setSuperD(-1);
                      } else if (superD === -1) {
                        setSuperD(-2);
                      }
                    }}
                    disabled={
                      (superD !== -1 && superD !== -2) || submitted || !isVoter
                    }
                    variant={superD === -2 ? "destructive" : "secondary"}
                    size={"lg"}
                    className="shadow-md"
                  >
                    {superD !== -1 ? (
                      <>
                        <ThumbsDownIcon /> Active SUPER DISLIKE
                      </>
                    ) : (
                      <>
                        <CircleXIcon /> Turn off SUPER DISLIKE
                      </>
                    )}
                  </Button>
                )}
                <Button
                  disabled={submitted || !isVoter}
                  onClick={handleSubmit}
                  size={"lg"}
                  className="shadow-md"
                >
                  Submit vote <ChevronRightIcon />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-center text-2xl font-semibold">
              Waiting for voting to finish.
            </h1>
            <div className="grid flex-1 grid-cols-3 gap-x-8 gap-y-4 px-6">
              {movies.map((movie, idx) => (
                <Skeleton
                  key={`movie-round-1-skeleton-${idx}`}
                  className="h-full w-full border shadow-md"
                />
              ))}
            </div>
            <div className="flex justify-between px-6">
              <p className="text-xl font-semibold">Round {round}/2</p>
              <p className="mr-4 font-semibold uppercase">
                {voteCount}/
                {voteSession?.members.filter((member) => member.isVoter).length}{" "}
                voted
              </p>
              <div></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoteRound;
