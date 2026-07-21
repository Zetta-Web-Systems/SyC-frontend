import { useMemo, useState } from "react";
import type { Exercise } from "@features/exercise";
import { useExercisesInfiniteQuery } from "@features/exercise";
import { useInfiniteScrollObserver } from "@shared/hooks/useInfiniteScrollObserver";

const PAGE_SIZE = 5;

interface UseExerciseSearchInfiniteResult {
  search: string;
  setSearch: (value: string) => void;
  items: Exercise[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

interface UseExerciseSearchInfiniteOptions {
  enabled: boolean;
}

export function useExerciseSearchInfinite({
  enabled,
}: UseExerciseSearchInfiniteOptions): UseExerciseSearchInfiniteResult {
  const [search, setSearch] = useState("");

  const query = useExercisesInfiniteQuery({
    pageSize: PAGE_SIZE,
    search: search || undefined,
    orderBy: "name",
    filters: ["isActive"],
    filtersValues: ["1"],
  });

  const items = useMemo<Exercise[]>(
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
