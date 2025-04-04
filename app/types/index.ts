import {
  Conversation,
  Message,
  User,
  VoteSession,
  VoteSessionMember,
  VoteSessionVote,
} from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
  voteSession?: VoteSession;
};

export type FullConversationType =
  | (Conversation & {
      users: User[];
      messages: FullMessageType[];
    })
  | null;

export type FullVoteSessionMemberType = VoteSessionMember & {
  user: User;
};

export type FullVoteSessionType =
  | (VoteSession & {
      conversation: Conversation;
      sender: User;
      members: FullVoteSessionMemberType[];
      voteSessionVotes: VoteSessionVote[];
    })
  | null;

export type TMDBMovie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string; // ISO date format as string
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
} | null;
