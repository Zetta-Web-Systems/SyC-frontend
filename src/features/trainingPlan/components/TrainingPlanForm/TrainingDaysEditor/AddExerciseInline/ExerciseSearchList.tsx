import type { RefObject } from "react";
import { SearchableInfiniteList } from "@shared/components/SearchableInfiniteList";
import type { Exercise } from "@features/exercise";
import { ExerciseSearchRow } from "./ExerciseSearchRow";

interface ExerciseSearchListProps {
  items: Exercise[];
  search: string;
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseSearchList({
  items,
  search,
  total,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isError,
  scrollRef,
  sentinelRef,
  onSelect,
}: ExerciseSearchListProps) {
  return (
    <SearchableInfiniteList<Exercise>
      search={search}
      items={items}
      total={total}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      isError={isError}
      scrollRef={scrollRef}
      sentinelRef={sentinelRef}
      keyFor={(ex) => ex.id}
      renderItem={(ex) => (
        <ExerciseSearchRow exercise={ex} onSelect={onSelect} />
      )}
      countLabel={({ total, hasSearch }) =>
        hasSearch ? `${total} resultados` : `${total} ejercicios`
      }
      emptyMessage="Sin ejercicios disponibles"
      errorMessage="Error al cargar ejercicios."
      listClassName="max-h-55 flex-none px-1 pt-0.5 pb-1.5"
    />
  );
}

ExerciseSearchList.displayName = "ExerciseSearchList";
