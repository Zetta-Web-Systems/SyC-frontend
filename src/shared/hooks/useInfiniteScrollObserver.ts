import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";

interface UseInfiniteScrollObserverOptions {
  enabled?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  rootMargin?: string;
  deps?: ReadonlyArray<unknown>;
}

export interface UseInfiniteScrollObserverResult {
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export function useInfiniteScrollObserver({
  enabled = true,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = "0px",
  deps = [],
}: UseInfiniteScrollObserverOptions): UseInfiniteScrollObserverResult {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!enabled) return;
    const sentinel = sentinelRef.current;
    const root = scrollRef.current;
    if (!sentinel || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNext();
      },
      { root, rootMargin },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, fetchNext, rootMargin, ...deps]);

  return { scrollRef, sentinelRef };
}
