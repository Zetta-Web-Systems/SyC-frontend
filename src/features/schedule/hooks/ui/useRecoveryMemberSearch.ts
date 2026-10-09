import { useMemo, useState } from "react";
import type { RefObject } from "react";
import { useInfiniteScrollObserver } from "@shared/hooks/useInfiniteScrollObserver";
import { useMembersInfiniteQuery, type Member } from "@features/members";

const PAGE_SIZE = 10;

export interface RecoveryMemberSearchState {
  search: string;
  setSearch: (value: string) => void;
  items: Member[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

interface UseRecoveryMemberSearchOptions {
  enabled: boolean;
}

/**
 * Buscador de alumnos activos para el alta de una recuperación.
 */
export function useRecoveryMemberSearch({
  enabled,
}: UseRecoveryMemberSearchOptions): RecoveryMemberSearchState {
  const [search, setSearch] = useState("");

  const query = useMembersInfiniteQuery({
    pageSize: PAGE_SIZE,
    search: search || undefined,
    orderBy: "lastname",
    filters: ["isActive"],
    filtersValues: ["1"],
  });

  const items = useMemo<Member[]>(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );

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
    total: query.data?.pages[0]?.pagination.total ?? 0,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    isError: query.isError,
    scrollRef,
    sentinelRef,
  };
}
