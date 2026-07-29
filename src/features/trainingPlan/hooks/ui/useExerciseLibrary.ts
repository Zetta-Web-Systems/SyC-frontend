import { useMemo, useState } from "react";
import type { RefObject } from "react";
import { useExercisesInfiniteQuery } from "@features/exercise";
import type { Exercise, ExerciseGroup } from "@features/exercise";
import { useGroupExercisesQuery } from "@features/exercise";
import { useInfiniteScrollObserver } from "@shared/hooks/useInfiniteScrollObserver";

const PAGE_SIZE = 20;
const SENTINEL_ROOT_MARGIN = "200px";

interface UseExerciseLibraryResult {
  search: string;
  setSearch: (value: string) => void;
  selectedGroup: ExerciseGroup | null;
  setSelectedGroup: (group: ExerciseGroup | null) => void;
  groups: ExerciseGroup[];
  isLoadingGroups: boolean;
  items: Exercise[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
  reset: () => void;
}

interface UseExerciseLibraryOptions {
  enabled: boolean;
}

export function useExerciseLibrary({
  enabled,
}: UseExerciseLibraryOptions): UseExerciseLibraryResult {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<ExerciseGroup | null>(
    null,
  );

  const groupsQuery = useGroupExercisesQuery({ page: 1, size: 100 });
  const groups = groupsQuery.data?.data ?? [];

  const query = useExercisesInfiniteQuery({
    pageSize: PAGE_SIZE,
    search: search || undefined,
    orderBy: "exerciseLevel",
    filters: selectedGroup ? ["isActive", "exerciseGroupId"] : ["isActive"],
    filtersValues: selectedGroup ? ["1", selectedGroup.id] : ["1"],
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
    rootMargin: SENTINEL_ROOT_MARGIN,
    deps: [items.length],
  });

  function reset() {
    setSearch("");
    setSelectedGroup(null);
  }

  return {
    search,
    setSearch,
    selectedGroup,
    setSelectedGroup,
    groups,
    isLoadingGroups: groupsQuery.isLoading,
    items,
    total,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    isError: query.isError,
    scrollRef,
    sentinelRef,
    reset,
  };
}
