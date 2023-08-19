"use client";

import { FC, useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/TextArea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useCustomToasts } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [comment, setComment] = useState<string>("");
  const { loginToast } = useCustomToasts();
  const router = useRouter();

  const { mutate: commentMutate, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was a problem",
        description: "Something went wrong. Please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setComment("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />
      </div>
      <div className="mt-2 flex justify-end">
        <Button
          isLoading={isLoading}
          disabled={comment.length === 0}
          onClick={() => commentMutate({ postId, text: comment, replyToId })}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreateComment;
