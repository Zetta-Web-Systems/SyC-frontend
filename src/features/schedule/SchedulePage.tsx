import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { ListState } from "@shared/components/ListState";
import { cn } from "@shared/lib/cn";
import { MemberChipOverlay } from "./components/common";
import { ScheduleBoard } from "./components/ScheduleBoard/ScheduleBoard";
import { ScheduleBoardSkeleton } from "./components/ScheduleBoard/ScheduleBoardSkeleton";
import { ScheduleLegend } from "./components/ScheduleBoard/ScheduleLegend";
import { ScheduleHeaderActions } from "./components/ScheduleHeaderActions/ScheduleHeaderActions";
import { ScheduleModals } from "./components/ScheduleModals/ScheduleModals";
import { ScheduleToolbar } from "./components/ScheduleToolbar/ScheduleToolbar";
import { UnassignedPanel } from "./components/UnassignedPanel/UnassignedPanel";
import { SCHEDULE_DAYS, SCHEDULE_WEEKEND_DAYS, type Shift } from "./constants";
import { useScheduleWeekQuery } from "./hooks/queries/useScheduleWeekQuery";
import { useScheduleDnd } from "./hooks/ui/useScheduleDnd";
import { useScheduleModals } from "./hooks/ui/useScheduleModals";
import { useScheduleSearch } from "./hooks/ui/useScheduleSearch";
import { useScheduleWeekNav } from "./hooks/ui/useScheduleWeekNav";
import { useShiftCollapse } from "./hooks/ui/useShiftCollapse";
import { useSlotExpansion } from "./hooks/ui/useSlotExpansion";
import { useUnassignedMembers } from "./hooks/ui/useUnassignedMembers";
import { useSlotActions } from "./hooks/useSlotActions";
import { useTurnActions } from "./hooks/useTurnActions";
import {
  dndAnnouncements,
  dndScreenReaderInstructions,
} from "./lib/scheduleDndA11y";
import { buildScheduleGrid } from "./lib/scheduleGrid";
import {
  formatWeekDescription,
  formatWeekRange,
  getWeekRange,
} from "./lib/scheduleWeek";

const NO_COLLAPSED_SHIFTS: ReadonlySet<Shift> = new Set();

export default function SchedulePage() {
  const week = useScheduleWeekNav();
  const { data, isLoading, isError, isPlaceholderData } = useScheduleWeekQuery(
    week.date,
  );

  const range = data ? { from: data.from, to: data.to } : week.fallbackRange;
  const rangeLabel = formatWeekRange(range.from, range.to);
  const description = formatWeekDescription(range.from, range.to);
  const isCurrentWeek = getWeekRange(new Date()).from === range.from;

  const { expandedIds, toggle, expand, expandAll, collapseAll } =
    useSlotExpansion();
  const { collapsedShifts, toggleShift } = useShiftCollapse();
  const [isUnassignedOpen, setIsUnassignedOpen] = useState(true);
  const [isWeekendVisible, setIsWeekendVisible] = useState(false);

  const search = useScheduleSearch(data);
  const unassigned = useUnassignedMembers({ enabled: isUnassignedOpen });
  const turnActions = useTurnActions();
  const modals = useScheduleModals();
  const dnd = useScheduleDnd({ onDropIntoSlot: expand });

  const visibleDays = useMemo(
    () =>
      isWeekendVisible
        ? [...SCHEDULE_DAYS, ...SCHEDULE_WEEKEND_DAYS]
        : SCHEDULE_DAYS,
    [isWeekendVisible],
  );

  const grid = useMemo(() => {
    if (!data) return null;
    if (isWeekendVisible) return buildScheduleGrid(data);

    return buildScheduleGrid({
      ...data,
      days: data.days.filter(
        (day) => !SCHEDULE_WEEKEND_DAYS.includes(day.dayOfWeek),
      ),
    });
  }, [data, isWeekendVisible]);

  const slotActions = useSlotActions(modals, grid);

  const assignableSlotIds = useMemo(
    () =>
      grid
        ? grid.rows.flatMap((row) =>
            row.cells.flatMap((cell) =>
              cell.kind === "slot" ? [cell.slot.id] : [],
            ),
          )
        : [],
    [grid],
  );

  const areAllExpanded =
    assignableSlotIds.length > 0 &&
    assignableSlotIds.every((slotId) => expandedIds.has(slotId));

  return (
    <DndContext
      sensors={dnd.sensors}
      collisionDetection={dnd.collisionDetection}
      onDragStart={dnd.handleDragStart}
      onDragEnd={dnd.handleDragEnd}
      onDragCancel={dnd.handleDragCancel}
      accessibility={{
        announcements: dndAnnouncements,
        screenReaderInstructions: dndScreenReaderInstructions,
      }}
    >
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Turnero"
          description={description}
          actions={
            <ScheduleHeaderActions
              onCloseDay={() => modals.openCloseDay()}
              onCreateTimeSlot={() => modals.openCreateSlot()}
            />
          }
        />

        <ScheduleToolbar
          rangeLabel={rangeLabel}
          isCurrentWeek={isCurrentWeek}
          onPreviousWeek={week.goToPreviousWeek}
          onNextWeek={week.goToNextWeek}
          onCurrentWeek={week.goToCurrentWeek}
          onMemberSearch={search.setSearch}
          isSearching={search.matches.isActive}
          matchCount={search.matches.slotIds.size}
          areAllExpanded={areAllExpanded}
          onExpandAll={() => expandAll(assignableSlotIds)}
          onCollapseAll={collapseAll}
          isUnassignedOpen={isUnassignedOpen}
          unassignedCount={unassigned.total}
          onToggleUnassigned={() => setIsUnassignedOpen((open) => !open)}
          isWeekendVisible={isWeekendVisible}
          onToggleWeekend={() => setIsWeekendVisible((visible) => !visible)}
        />

        <div
          className={cn(
            "grid items-start gap-5",
            isUnassignedOpen && "lg:grid-cols-[1fr_18.5rem]",
          )}
        >
          <div className="flex min-w-0 flex-col gap-4">
            {isLoading && <ScheduleBoardSkeleton days={visibleDays} />}

            {isError && (
              <ListState
                kind="error"
                variant="dashed-card"
                message="No se pudo cargar el turnero"
                description="Volvé a intentar en unos segundos."
              />
            )}

            {grid && !isError && grid.rows.length === 0 && (
              <ListState
                kind="empty"
                variant="dashed-card"
                message="Todavía no hay horarios cargados"
                description="Creá el primero desde el botón de arriba."
              />
            )}

            {grid && !isError && grid.rows.length > 0 && (
              <ScheduleBoard
                grid={grid}
                expandedIds={expandedIds}
                onToggleSlot={toggle}
                actions={turnActions}
                slotActions={slotActions}
                isDragging={dnd.isDragging}
                matches={search.matches}
                collapsedShifts={
                  search.matches.isActive
                    ? NO_COLLAPSED_SHIFTS
                    : collapsedShifts
                }
                onToggleShift={toggleShift}
                onCloseDay={modals.openCloseDay}
                onAddTimeSlot={() => modals.openCreateSlot()}
                isRefreshing={isPlaceholderData}
              />
            )}

            {grid && !isError && grid.rows.length > 0 && <ScheduleLegend />}
          </div>

          {isUnassignedOpen && (
            <UnassignedPanel state={unassigned} isDragging={dnd.isDragging} />
          )}
        </div>
      </div>

      <ScheduleModals state={modals} />

      {createPortal(
        <DragOverlay dropAnimation={null}>
          {dnd.activeDrag && (
            <MemberChipOverlay member={dnd.activeDrag.member} />
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
