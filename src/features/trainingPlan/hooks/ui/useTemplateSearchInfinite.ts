import { useMemo, useState } from "react";
import { useInfiniteScrollObserver } from "@shared/hooks/useInfiniteScrollObserver";
import { PlanState, TRAINING_PLANS_ORDER_BY } from "../../constants";
import type { TrainingPlanSimple } from "../../types";
import { useTrainingPlansInfiniteQuery } from "../queries/useTrainingPlansInfiniteQuery";

const PAGE_SIZE = 6;

interface UseTemplateSearchInfiniteResult {
  search: string;
  setSearch: (value: string) => void;
  items: TrainingPlanSimple[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

interface UseTemplateSearchInfiniteOptions {
  enabled: boolean;
}

export function useTemplateSearchInfinite({
  enabled,
}: UseTemplateSearchInfiniteOptions): UseTemplateSearchInfiniteResult {
  const [search, setSearch] = useState("");

  const query = useTrainingPlansInfiniteQuery({
    pageSize: PAGE_SIZE,
    search: search || undefined,
    orderBy: TRAINING_PLANS_ORDER_BY,
    filters: ["state"],
    filtersValues: [PlanState.TEMPLATE],
  });

  const items = useMemo<TrainingPlanSimple[]>(
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
