import type { RefObject } from "react";
import { SearchableInfiniteList } from "@shared/components/SearchableInfiniteList";
import type { Member } from "@features/members";
import { MemberRow } from "./MemberRow";

interface MemberSearchListProps {
  search: string;
  items: Member[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  sentinelRef: RefObject<HTMLDivElement | null>;
  selectedMember: Member | null;
  onSelect: (member: Member) => void;
}

export function MemberSearchList({
  search,
  items,
  total,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isError,
  scrollRef,
  sentinelRef,
  selectedMember,
  onSelect,
}: MemberSearchListProps) {
  return (
    <SearchableInfiniteList<Member>
      search={search}
      items={items}
      total={total}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      isError={isError}
      scrollRef={scrollRef}
      sentinelRef={sentinelRef}
      keyFor={(m) => m.id}
      renderItem={(m) => (
        <MemberRow
          member={m}
          isSelected={selectedMember?.id === m.id}
          onSelect={onSelect}
        />
      )}
      sectionTitle="Asignar a un alumno"
      sectionLabelClassName="px-3.5 pt-2 pb-1"
      countLabel={({ total, hasSearch }) =>
        hasSearch ? `${total} resultados` : `${total} alumnos`
      }
      emptyMessage="Sin alumnos disponibles"
      errorMessage="Error al cargar alumnos."
      listClassName="h-55 flex-none px-1.5 pt-0.5 pb-1.5"
    />
  );
}

MemberSearchList.displayName = "MemberSearchList";
