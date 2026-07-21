import type { ReactNode, RefObject } from "react";
import { Search } from "lucide-react";
import { SearchInput } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { InfiniteScrollList } from "../InfiniteScrollList/InfiniteScrollList";
import { ListState } from "../ListState/ListState";
import { SectionLabel } from "../SectionLabel/SectionLabel";

interface SearchSlotProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchDelay?: number;
  searchSlotClassName?: string;
  toolbarSlot?: ReactNode;
  toolbarPosition?: "before" | "after";
}

export interface SearchableInfiniteListProps<T> {
  search: string;
  searchSlot?: Omit<SearchSlotProps, "search">;
  items: T[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
  keyFor: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  sectionTitle?: ReactNode;
  countLabel?: (args: {
    total: number;
    hasSearch: boolean;
    search: string;
  }) => ReactNode;
  sectionLabelClassName?: string;
  emptyIcon?: ReactNode;
  emptyMessage?: ReactNode;
  emptySearchMessage?: (search: string) => ReactNode;
  errorMessage?: string;
  listClassName?: string;
  listContainerClassName?: string;
}

export function SearchableInfiniteList<T>({
  search,
  searchSlot,
  items,
  total,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isError,
  scrollRef,
  sentinelRef,
  keyFor,
  renderItem,
  sectionTitle,
  countLabel,
  sectionLabelClassName,
  emptyIcon = <Search size={18} aria-hidden="true" />,
  emptyMessage = "Sin resultados",
  emptySearchMessage,
  errorMessage = "Error al cargar.",
  listClassName,
  listContainerClassName,
}: SearchableInfiniteListProps<T>) {
  const hasSearch = search.trim().length > 0;
  const resolvedCountLabel = countLabel
    ? countLabel({ total, hasSearch, search })
    : hasSearch
      ? `${total} resultados`
      : `${total}`;

  const resolvedEmptyMessage =
    hasSearch && emptySearchMessage ? (
      emptySearchMessage(search)
    ) : hasSearch ? (
      <>
        Sin resultados para <b>"{search}"</b>
      </>
    ) : (
      emptyMessage
    );

  return (
    <>
      {searchSlot && (
        <div className={cn("p-3", searchSlot.searchSlotClassName)}>
          {searchSlot.toolbarPosition === "before" && searchSlot.toolbarSlot}
          <SearchInput
            placeholder={searchSlot.searchPlaceholder ?? "Buscar"}
            onSearch={searchSlot.onSearchChange}
            delay={searchSlot.searchDelay ?? 300}
          />
          {searchSlot.toolbarPosition !== "before" && searchSlot.toolbarSlot}
        </div>
      )}

      {sectionTitle !== undefined && (
        <SectionLabel
          title={sectionTitle}
          trailing={resolvedCountLabel}
          className={sectionLabelClassName}
        />
      )}

      <InfiniteScrollList<T>
        items={items}
        keyFor={keyFor}
        scrollRef={scrollRef}
        sentinelRef={sentinelRef}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        isError={isError}
        className={listClassName}
        listClassName={listContainerClassName}
        endLabel={false}
        emptyState={
          <ListState
            kind="empty"
            icon={emptyIcon}
            message={resolvedEmptyMessage}
          />
        }
        errorState={<ListState kind="error" message={errorMessage} />}
        renderItem={renderItem}
      />
    </>
  );
}

SearchableInfiniteList.displayName = "SearchableInfiniteList";
