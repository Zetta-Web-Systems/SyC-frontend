import { Fragment, useMemo } from "react";
import { CalendarOff, ChevronDown, Plus } from "lucide-react";
import { Card } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { formatDayMonth } from "@shared/utils/date.utils";
import { SCHEDULE_DAY_LABELS, SHIFT_LABELS, type Shift } from "../../constants";
import type { SlotActions } from "../../hooks/useSlotActions";
import type { TurnActions } from "../../hooks/useTurnActions";
import { getRowDays } from "../../lib/scheduleRows";
import type { ScheduleSearchMatches } from "../../lib/scheduleSearch";
import type { ScheduleDayInfo, ScheduleGrid } from "../../types";
import { ScheduleCell } from "./ScheduleCell/ScheduleCell";
import { ScheduleTimeLabel } from "./ScheduleRow/ScheduleTimeLabel";

interface ScheduleDayHeaderProps {
  day: ScheduleDayInfo;
  isFirst: boolean;
  onCloseDay: (date: string) => void;
}

function ScheduleDayHeader({
  day,
  isFirst,
  onCloseDay,
}: ScheduleDayHeaderProps) {
  const { closure } = day;

  return (
    <button
      type="button"
      onClick={() => onCloseDay(day.date)}
      title={closure ? `Cerrado: ${closure.type}` : "Cerrar este día completo"}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-0.5 bg-primary-500 px-1.5 py-2.5 text-center transition-colors hover:bg-primary-600 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none focus-visible:-outline-offset-2",
        !isFirst && "border-l border-primary-400",
      )}
    >
      <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-white uppercase">
        {closure && <CalendarOff size={12} aria-hidden="true" />}
        {SCHEDULE_DAY_LABELS[day.dayOfWeek]}
      </span>
      <span className="text-[11px] font-medium text-primary-100">
        {formatDayMonth(day.date)}
      </span>
    </button>
  );
}

interface ScheduleShiftRowProps {
  shift: Shift;
  rowCount: number;
  isCollapsed: boolean;
  onToggle: (shift: Shift) => void;
}

function ScheduleShiftRow({
  shift,
  rowCount,
  isCollapsed,
  onToggle,
}: ScheduleShiftRowProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(shift)}
      aria-expanded={!isCollapsed}
      className="col-span-full flex cursor-pointer items-center justify-center gap-2 border-y border-neutral-200 bg-neutral-50 px-3.5 py-2 text-[11.5px] font-extrabold tracking-widest text-neutral-400 uppercase transition-colors hover:bg-neutral-100 hover:text-neutral-600 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none focus-visible:-outline-offset-2"
    >
      <ChevronDown
        size={14}
        aria-hidden="true"
        className={cn("transition-transform", isCollapsed && "-rotate-90")}
      />

      {SHIFT_LABELS[shift]}

      {isCollapsed && (
        <span className="font-bold tracking-normal normal-case">
          ({rowCount} {rowCount === 1 ? "horario" : "horarios"})
        </span>
      )}
    </button>
  );
}

interface AddTimeSlotRowProps {
  onCreate: () => void;
}

function AddTimeSlotRow({ onCreate }: AddTimeSlotRowProps) {
  return (
    <button
      type="button"
      onClick={onCreate}
      className="col-span-full m-1.5 flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-neutral-300 py-3 text-[13px] font-bold text-neutral-400 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
    >
      <Plus size={14} aria-hidden="true" />
      Agregar horario
    </button>
  );
}

interface ScheduleBoardProps {
  grid: ScheduleGrid;
  expandedIds: ReadonlySet<string>;
  onToggleSlot: (slotId: string) => void;
  actions: TurnActions;
  slotActions: SlotActions;
  isDragging: boolean;
  matches: ScheduleSearchMatches;
  collapsedShifts: ReadonlySet<Shift>;
  onToggleShift: (shift: Shift) => void;
  onCloseDay: (date: string) => void;
  onAddTimeSlot: () => void;
  isRefreshing?: boolean;
}

export function ScheduleBoard({
  grid,
  expandedIds,
  onToggleSlot,
  actions,
  slotActions,
  isDragging,
  matches,
  collapsedShifts,
  onToggleShift,
  onCloseDay,
  onAddTimeSlot,
  isRefreshing = false,
}: ScheduleBoardProps) {
  const rowsPerShift = useMemo(() => {
    const counts = new Map<Shift, number>();
    for (const row of grid.rows) {
      counts.set(row.shift, (counts.get(row.shift) ?? 0) + 1);
    }
    return counts;
  }, [grid.rows]);

  return (
    <Card
      surface="panel"
      role="region"
      aria-label="Grilla del turnero"
      className="overflow-hidden"
    >
      <div className="overflow-x-auto">
        <div
          className={cn(
            "grid transition-opacity",
            isRefreshing && "opacity-60",
          )}
          style={{
            gridTemplateColumns: `112px repeat(${grid.days.length}, minmax(168px, 1fr))`,
            minWidth: `${112 + grid.days.length * 168}px`,
          }}
        >
          <div className="sticky left-0 z-40 bg-primary-500" />
          {grid.days.map((day, index) => (
            <ScheduleDayHeader
              key={day.date}
              day={day}
              isFirst={index === 0}
              onCloseDay={onCloseDay}
            />
          ))}

          {grid.rows.map((row, index) => {
            const startsShift =
              index === 0 || grid.rows[index - 1].shift !== row.shift;
            const isShiftCollapsed = collapsedShifts.has(row.shift);
            const rowDays = getRowDays(row);

            return (
              <Fragment key={`${row.startTime}|${row.endTime}`}>
                {startsShift && (
                  <ScheduleShiftRow
                    shift={row.shift}
                    rowCount={rowsPerShift.get(row.shift) ?? 0}
                    isCollapsed={isShiftCollapsed}
                    onToggle={onToggleShift}
                  />
                )}

                {!isShiftCollapsed && (
                  <>
                    <ScheduleTimeLabel
                      startTime={row.startTime}
                      endTime={row.endTime}
                      rowDays={rowDays}
                      actions={slotActions}
                    />

                    {row.cells.map((cell) => (
                      <div
                        key={cell.id}
                        className="flex border-t border-l border-neutral-100 p-1.5"
                      >
                        <ScheduleCell
                          cell={cell}
                          isExpanded={
                            cell.kind === "slot" &&
                            expandedIds.has(cell.slot.id)
                          }
                          onToggle={onToggleSlot}
                          actions={actions}
                          slotActions={slotActions}
                          isDragging={isDragging}
                          matches={matches}
                        />
                      </div>
                    ))}
                  </>
                )}
              </Fragment>
            );
          })}

          <AddTimeSlotRow onCreate={onAddTimeSlot} />
        </div>
      </div>
    </Card>
  );
}

ScheduleBoard.displayName = "ScheduleBoard";
