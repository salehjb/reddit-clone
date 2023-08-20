"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import Link from "next/link";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const router = useRouter();
  const commandRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const {
    data: queryResult,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!searchInput) return [];
      const { data } = await axios.get(`/api/search?q=${searchInput}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const request = debounce(() => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  useOnClickOutside(commandRef, () => {
    setSearchInput("");
  });

  useEffect(() => {
    setSearchInput("");
  }, [pathname]);

  return (
    <Command
      className="relative rouned-lg border max-w-lg z-50 overflow-visible"
      ref={commandRef}
    >
      <CommandInput
        value={searchInput}
        onValueChange={(text) => {
          setSearchInput(text);
          debounceRequest();
        }}
        className="outline-none border-none focus:border-none focus:outline-none"
        placeholder="Search communities..."
      />
      {searchInput.length > 0 ? (
        <div>
          <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
            {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
            {(queryResult?.length ?? 0) > 0 ? (
              <CommandGroup heading="Communities">
                {queryResult?.map((subreddit) => (
                  <CommandItem
                    key={subreddit.id}
                    onSelect={(e) => {
                      router.push(`/r/${e}`);
                      router.refresh();
                    }}
                    value={subreddit.name}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <Link href={`/r/${subreddit.name}`}>
                      r/{subreddit.name}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </div>
      ) : null}
    </Command>
  );
};

export default SearchBar;
