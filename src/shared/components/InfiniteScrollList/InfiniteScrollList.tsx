import type { ReactNode, RefObject } from "react";
import { cn } from "@shared/lib/cn";
import { ListState } from "../ListState/ListState";

export interface InfiniteScrollListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyFor: (item: T, index: number) => string | number;
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError?: boolean;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  endLabel?: ReactNode;
  className?: string;
  listClassName?: string;
}

export function InfiniteScrollList<T>({
  items,
  renderItem,
  keyFor,
  scrollRef,
  sentinelRef,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isError = false,
  emptyState,
  errorState,
  endLabel,
  className,
  listClassName,
}: InfiniteScrollListProps<T>) {
  const showEmpty = !isLoading && items.length === 0 && !isError;
  const showEnd =
    !hasNextPage && !isLoading && items.length > 0 && endLabel !== false;

  return (
    <div
      ref={scrollRef}
      className={cn("scrollbar-hide flex-1 overflow-y-auto", className)}
    >
      {showEmpty && (emptyState ?? <ListState kind="empty" />)}

      <div className={listClassName}>
        {items.map((item, i) => (
          <div key={keyFor(item, i)}>{renderItem(item, i)}</div>
        ))}
      </div>

      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      {(isLoading || isFetchingNextPage) && (
        <ListState kind="loading" size="sm" />
      )}

      {showEnd && (
        <div className="py-2 text-center text-[10.5px] tracking-wider text-neutral-400">
          {endLabel ?? `· Fin de la lista · ${items.length} cargados ·`}
        </div>
      )}

      {isError && (errorState ?? <ListState kind="error" />)}
    </div>
  );
}

InfiniteScrollList.displayName = "InfiniteScrollList";
