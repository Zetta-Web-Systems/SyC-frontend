import { useDraggable, useDroppable } from "@dnd-kit/core";
import { UserRoundSearch } from "lucide-react";
import { Card } from "@shared/ui";
import { SearchableInfiniteList } from "@shared/components/SearchableInfiniteList";
import { cn } from "@shared/lib/cn";
import type { MemberSimple } from "@features/members";
import type { UnassignedMembersState } from "../../hooks/ui/useUnassignedMembers";
import { formatMemberFullName } from "../../lib/memberDisplay";
import {
  DRAG_TYPE,
  DROP_TYPE,
  UNASSIGNED_DROP_ID,
  unassignedDragId,
  type UnassignedDragData,
  type UnassignedDropData,
} from "../../lib/scheduleDnd";
import { MemberChip } from "../common";

const DROP_DATA: UnassignedDropData = {
  type: DROP_TYPE.UNASSIGNED,
  label: "la lista de sin asignar",
};

interface UnassignedMemberChipProps {
  member: MemberSimple;
}

function UnassignedMemberChip({ member }: UnassignedMemberChipProps) {
  const data: UnassignedDragData = { type: DRAG_TYPE.UNASSIGNED, member };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: unassignedDragId(member.id),
    data,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-label={`Arrastrá a ${formatMemberFullName(member)} a un horario`}
      className={cn(
        "rounded-full transition-opacity select-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
        isDragging ? "cursor-grabbing opacity-40" : "cursor-grab",
      )}
    >
      <MemberChip
        member={member}
        className="border-dashed border-neutral-300 text-neutral-500"
      />
    </div>
  );
}

interface UnassignedPanelProps {
  state: UnassignedMembersState;
  isDragging: boolean;
}

export function UnassignedPanel({ state, isDragging }: UnassignedPanelProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: UNASSIGNED_DROP_ID,
    data: DROP_DATA,
  });

  return (
    <Card
      ref={setNodeRef}
      surface="panel"
      className={cn(
        "sticky top-5 flex max-h-[calc(100dvh-8rem)] flex-col transition-all",
        isDragging && !isOver && "border-dashed border-primary-300",
        isOver &&
          "border-transparent bg-primary-50 ring-2 ring-primary-400 ring-offset-2 ring-offset-neutral-50",
      )}
    >
      <SearchableInfiniteList<MemberSimple>
        search={state.search}
        searchSlot={{
          searchPlaceholder: "Buscar alumno",
          onSearchChange: state.setSearch,
          searchSlotClassName: "border-b border-neutral-100",
        }}
        items={state.items}
        total={state.total}
        isLoading={state.isLoading}
        isFetchingNextPage={state.isFetchingNextPage}
        hasNextPage={state.hasNextPage}
        isError={state.isError}
        scrollRef={state.scrollRef}
        sentinelRef={state.sentinelRef}
        keyFor={(member) => member.id}
        renderItem={(member) => <UnassignedMemberChip member={member} />}
        sectionTitle="Sin asignar"
        listContainerClassName="flex flex-wrap gap-1.5 px-3 pb-3"
        emptyIcon={<UserRoundSearch size={18} aria-hidden="true" />}
        emptyMessage="Todos los alumnos tienen turno"
        errorMessage="No se pudo cargar la lista."
      />

      <p className="border-t border-neutral-100 px-3 py-3 text-xs leading-relaxed text-neutral-400">
        Arrastrá un alumno hasta un horario para anotarlo. Para sacarlo,
        arrastralo de vuelta acá.
      </p>
    </Card>
  );
}

UnassignedPanel.displayName = "UnassignedPanel";
