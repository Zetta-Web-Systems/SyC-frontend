import { useMemo, useState } from "react";
import type { RefObject } from "react";
import { useInfiniteScrollObserver } from "@shared/hooks/useInfiniteScrollObserver";
import { useUnassignedMembersQuery } from "../queries/useUnassignedMembersQuery";
import type { UnassignedMember } from "../../types";

interface UseUnassignedMembersOptions {
  enabled: boolean;
}

export interface UnassignedMembersState {
  search: string;
  setSearch: (value: string) => void;
  items: UnassignedMember[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export function useUnassignedMembers({
  enabled,
}: UseUnassignedMembersOptions): UnassignedMembersState {
  const [search, setSearch] = useState("");
  const query = useUnassignedMembersQuery(search);

  const items = useMemo<UnassignedMember[]>(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );

  const total = query.data?.pages[0]?.pagination.total ?? 0;

  const { scrollRef, sentinelRef } = useInfiniteScrollObserver({
    enabled,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: () => void query.fetchNextPage(),
    deps: [items.length],
  });

  return {
    search,
    setSearch,
    items,
    total,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    isError: query.isError,
    scrollRef,
    sentinelRef,
  };
}
