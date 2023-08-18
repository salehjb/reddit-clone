"use client";

import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [googleIsLoading, setGoogleIsLoading] = useState<boolean>(false);
  const [githubIsLoading, setGithubIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithGithub = async () => {
    setGithubIsLoading(true);
    try {
      await signIn("github");
    } catch (error) {
      toast({
        title: "There was problem.",
        description: "There was an error logging in with Github",
        variant: "destructive",
      });
    } finally {
      setGithubIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setGoogleIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "There was problem.",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    } finally {
      setGoogleIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col justify-center gap-2", className)} {...props}>
      <Button
        onClick={loginWithGithub}
        isLoading={githubIsLoading}
        size="sm"
        className="w-full"
      >
        {githubIsLoading ? null : <Icons.github className="h-5 w-5 mr-2 fill-white" />}
        Github
      </Button>
      <Button
        onClick={loginWithGoogle}
        isLoading={googleIsLoading}
        size="sm"
        className="w-full"
      >
        {googleIsLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
