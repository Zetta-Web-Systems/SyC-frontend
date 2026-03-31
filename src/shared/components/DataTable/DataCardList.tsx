import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

export interface DataCardListProps<TData> {
  data: TData[];
  renderCard: (item: TData, index: number) => ReactNode;
  isLoading?: boolean;
  noResultsMessage?: string;
  className?: string;
}

export function DataCardList<TData>({
  data,
  renderCard,
  isLoading = false,
  noResultsMessage = "No se encontraron resultados.",
  className,
}: DataCardListProps<TData>) {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-neutral-200 bg-primary-50 p-4"
          >
            <div className="h-4 w-3/4 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-1/2 rounded bg-neutral-100" />
            <div className="mt-2 h-3 w-1/3 rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white px-4 py-12 text-center text-sm text-neutral-400">
        {noResultsMessage}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3 mt-3", className)}>
      {data.map((item, index) => renderCard(item, index))}
    </div>
  );
}

DataCardList.displayName = "DataCardList";
