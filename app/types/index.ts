import { Conversation, Message, User, VoteSession } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
  voteSession?: VoteSession;
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
} | null;

export type FullVoteSessionType = (VoteSession & {
  conversation: Conversation;
  sender: User;
}) | null