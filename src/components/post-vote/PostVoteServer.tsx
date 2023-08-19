import { getAuthSession } from "@/lib/auth";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVotesAmount?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PostVoteServer = async ({
  postId,
  initialVotesAmount,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let votesAmount: number = 0;
  let currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    await wait(2000)
    const post = await getData();
    if (!post) return notFound();
    votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);
    currentVote = post.votes.find((vote) => vote.userId === session?.user.id)
      ?.type;
  } else {
    votesAmount = initialVotesAmount!;
    currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmount={votesAmount}
      initialVote={currentVote}
    />
  );
};

export default PostVoteServer;
