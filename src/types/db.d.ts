import { Comment, Subreddit, User, Vote } from "@prisma/client"

export type ExtendedPost = {
    id: string;
    subreddit: Subreddit,
    votes: Vote[],
    author: User,
    comments: Comment[]
    createdAt: Date
    title: string
    content: any
}