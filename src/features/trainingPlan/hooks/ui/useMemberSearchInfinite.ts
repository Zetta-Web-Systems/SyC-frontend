import { useMemo, useState } from "react";
import type { Member } from "@features/members";
import { useMembersInfiniteQuery } from "@features/members";
import { useInfiniteScrollObserver } from "@shared/hooks/useInfiniteScrollObserver";

const PAGE_SIZE = 5;

interface UseMemberSearchInfiniteResult {
  search: string;
  setSearch: (value: string) => void;
  items: Member[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

interface UseMemberSearchInfiniteOptions {
  enabled: boolean;
}

export function useMemberSearchInfinite({
  enabled,
}: UseMemberSearchInfiniteOptions): UseMemberSearchInfiniteResult {
  const [search, setSearch] = useState("");

  const query = useMembersInfiniteQuery({
    pageSize: PAGE_SIZE,
    search: search || undefined,
    orderBy: "lastname",
    filters: ["isActive"],
    filtersValues: ["1"],
  });

  const items = useMemo<Member[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
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
