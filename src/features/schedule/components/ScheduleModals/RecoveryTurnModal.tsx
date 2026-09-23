import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Avatar, Button, Modal } from "@shared/ui";
import { SearchableInfiniteList } from "@shared/components/SearchableInfiniteList";
import { ListState } from "@shared/components/ListState";
import { cn } from "@shared/lib/cn";
import { formatDateToISO, formatDayMonth } from "@shared/utils/date.utils";
import type { Member } from "@features/members";
import {
  SCHEDULE_ALL_DAYS,
  SCHEDULE_DAY_LABELS,
  SCHEDULE_DAY_SHORT_LABELS,
  SLOT_STATUS,
  type ScheduleDay,
} from "../../constants";
import { useAddRecoveryTurnMutation } from "../../hooks/mutations/useAddRecoveryTurnMutation";
import { useScheduleWeekQuery } from "../../hooks/queries/useScheduleWeekQuery";
import { useRecoveryMemberSearch } from "../../hooks/ui/useRecoveryMemberSearch";
import {
  formatMemberFullName,
  formatMemberInitials,
} from "../../lib/memberDisplay";
import { buildScheduleGrid } from "../../lib/scheduleGrid";
import {
  getAvailableRecoveryCells,
  getMembersWithRecoveryOnDate,
} from "../../lib/scheduleRecovery";
import {
  addWeeks,
  formatWeekRange,
  getWeekRange,
  parseISODate,
} from "../../lib/scheduleWeek";
import { formatSlotRange, formatSlotTime } from "../../lib/slotStatus";
import type { RecoveryTurnMode, SlotCellData } from "../../types";

type CellMode = Extract<RecoveryTurnMode, { kind: "cell" }>;
type MemberMode = Extract<RecoveryTurnMode, { kind: "member" }>;

interface SlotLabelParts {
  dayOfWeek: ScheduleDay;
  date: string;
  startTime: string;
}

function formatSlotLabel(parts: SlotLabelParts): string {
  const day = SCHEDULE_DAY_LABELS[parts.dayOfWeek];
  return `${day} ${formatDayMonth(parts.date)} a las ${formatSlotTime(parts.startTime)}`;
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between gap-3 rounded-lg bg-neutral-50 p-3 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right font-medium text-neutral-900">{value}</span>
    </div>
  );
}

interface ModalFooterProps {
  onClose: () => void;
  onSubmit: () => void;
  isPending: boolean;
  isDisabled: boolean;
}

function ModalFooter({
  onClose,
  onSubmit,
  isPending,
  isDisabled,
}: ModalFooterProps) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button intent="neutral" variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button
        intent="primary"
        isLoading={isPending}
        disabled={isDisabled}
        onClick={onSubmit}
      >
        Agregar recuperación
      </Button>
    </div>
  );
}

interface MemberOptionProps {
  member: Member;
  isSelected: boolean;
  onSelect: (member: Member) => void;
}

function MemberOption({ member, isSelected, onSelect }: MemberOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className={cn(
        "my-px flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors",
        isSelected ? "bg-primary-500/10" : "hover:bg-neutral-50",
      )}
    >
      <Avatar
        size="sm"
        color="primary"
        src={member.image}
        fallback={formatMemberInitials(member)}
      />

      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral-900">
        {formatMemberFullName(member)}
      </span>

      {isSelected && (
        <Check
          size={14}
          aria-hidden="true"
          className="shrink-0 text-primary-600"
        />
      )}
    </button>
  );
}

interface RecoveryByCellProps {
  mode: CellMode;
  weekDate: string;
  onClose: () => void;
}

function RecoveryByCell({ mode, weekDate, onClose }: RecoveryByCellProps) {
  const [selected, setSelected] = useState<Member | null>(null);
  const mutation = useAddRecoveryTurnMutation();
  const search = useRecoveryMemberSearch({ enabled: true });
  const { data: week } = useScheduleWeekQuery(weekDate);

  const alreadyRecovering = useMemo(
    () => getMembersWithRecoveryOnDate(week, mode.date),
    [week, mode.date],
  );

  const items = useMemo(
    () => search.items.filter((member) => !alreadyRecovering.has(member.id)),
    [search.items, alreadyRecovering],
  );

  function handleSubmit() {
    if (!selected) return;

    mutation.mutate(
      {
        dto: {
          timeSlotId: mode.slot.id,
          memberId: selected.id,
          date: mode.date,
        },
        memberName: formatMemberFullName(selected),
        slotLabel: formatSlotLabel({
          dayOfWeek: mode.slot.dayOfWeek,
          date: mode.date,
          startTime: mode.slot.startTime,
        }),
      },
      { onSuccess: onClose },
    );
  }

  const slotValue = `${SCHEDULE_DAY_LABELS[mode.slot.dayOfWeek]} ${formatDayMonth(mode.date)}, ${formatSlotRange(mode.slot.startTime, mode.slot.endTime)}`;

  return (
    <div className="flex flex-col gap-4 px-6 py-5">
      <SummaryRow label="Horario" value={slotValue} />

      <div className="rounded-xl border border-neutral-200">
        <SearchableInfiniteList<Member>
          search={search.search}
          searchSlot={{
            searchPlaceholder: "Buscar alumno",
            onSearchChange: search.setSearch,
            searchSlotClassName: "border-b border-neutral-100",
          }}
          items={items}
          total={search.total}
          isLoading={search.isLoading}
          isFetchingNextPage={search.isFetchingNextPage}
          hasNextPage={search.hasNextPage}
          isError={search.isError}
          scrollRef={search.scrollRef}
          sentinelRef={search.sentinelRef}
          keyFor={(member) => member.id}
          renderItem={(member) => (
            <MemberOption
              member={member}
              isSelected={selected?.id === member.id}
              onSelect={setSelected}
            />
          )}
          sectionTitle="Alumno que recupera"
          sectionLabelClassName="px-3.5 pt-2 pb-1"
          countLabel={({ total, hasSearch }) =>
            hasSearch ? `${total} resultados` : `${total} alumnos`
          }
          emptyMessage="No quedan alumnos para anotar ese día"
          errorMessage="Error al cargar alumnos."
          listClassName="h-55 flex-none px-1.5 pt-0.5 pb-1.5"
        />
      </div>

      <p className="-mt-1 text-xs text-neutral-400">
        La recuperación suma al cupo y vale sólo para esa fecha. El turno fijo
        del alumno no se toca.
      </p>

      <ModalFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        isDisabled={!selected}
      />
    </div>
  );
}

interface WeekPickerProps {
  rangeLabel: string;
  canGoBack: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

function WeekPicker({
  rangeLabel,
  canGoBack,
  onPrevious,
  onNext,
}: WeekPickerProps) {
  return (
    <div className="flex items-center justify-between gap-1 rounded-xl border border-neutral-200 p-1">
      <Button
        variant="ghost"
        intent="neutral"
        size="icon"
        aria-label="Semana anterior"
        disabled={!canGoBack}
        onClick={onPrevious}
        className="size-8"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </Button>

      <span className="text-[13.5px] font-semibold text-neutral-800">
        {rangeLabel}
      </span>

      <Button
        variant="ghost"
        intent="neutral"
        size="icon"
        aria-label="Semana siguiente"
        onClick={onNext}
        className="size-8"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}

interface DayOptionsProps {
  dates: string[];
  dayLabels: Map<string, string>;
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

function DayOptions({
  dates,
  dayLabels,
  selectedDate,
  onSelect,
}: DayOptionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {dates.map((date) => (
        <button
          key={date}
          type="button"
          onClick={() => onSelect(date)}
          className={cn(
            "flex min-w-16 flex-col items-center gap-0.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
            date === selectedDate
              ? "border-primary-500 bg-primary-50 text-primary-700"
              : "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
          )}
        >
          {dayLabels.get(date)}
          <span className="text-[11px] font-medium text-neutral-400">
            {formatDayMonth(date)}
          </span>
        </button>
      ))}
    </div>
  );
}

interface SlotOptionsProps {
  cells: SlotCellData[];
  selectedId: string | null;
  onSelect: (cell: SlotCellData) => void;
}

function SlotOptions({ cells, selectedId, onSelect }: SlotOptionsProps) {
  return (
    <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
      {cells.map((cell) => {
        const isFull =
          cell.status === SLOT_STATUS.FULL || cell.status === SLOT_STATUS.OVER;

        return (
          <button
            key={cell.id}
            type="button"
            onClick={() => onSelect(cell)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
              cell.id === selectedId
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 hover:bg-neutral-50",
            )}
          >
            <span className="font-medium text-neutral-900">
              {formatSlotRange(cell.startTime, cell.endTime)}
            </span>

            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                isFull ? "text-error" : "text-neutral-500",
              )}
            >
              {cell.roster.length}/{cell.slot.capacity}
              {isFull && " · queda excedido"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface RecoveryByMemberProps {
  mode: MemberMode;
  weekDate: string;
  onClose: () => void;
}

/**
 * Alumno congelado: se eligen semana, día y horario. Las opciones salen de la
 * grilla real, así que es imposible mandar un horario que no sea del día elegido.
 */
function RecoveryByMember({ mode, weekDate, onClose }: RecoveryByMemberProps) {
  const [week, setWeek] = useState(weekDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<SlotCellData | null>(null);

  const mutation = useAddRecoveryTurnMutation();
  const { data, isLoading } = useScheduleWeekQuery(week);

  const availableCells = useMemo(() => {
    if (!data) return [];

    // INFO: Se arma la grilla con los 7 días, no con los visibles: el fin de semana
    // apagado en el turnero no debería esconder un día donde sí se puede recuperar.
    const grid = buildScheduleGrid(data, SCHEDULE_ALL_DAYS);

    const takenDates = new Set(
      data.recoveries
        .filter((recovery) => recovery.member.id === mode.member.id)
        .map((recovery) => recovery.date),
    );

    return getAvailableRecoveryCells(grid, new Date()).filter(
      (cell) => !takenDates.has(cell.date),
    );
  }, [data, mode.member.id]);

  const dates = useMemo(
    () => [...new Set(availableCells.map((cell) => cell.date))],
    [availableCells],
  );

  const dayLabels = useMemo(
    () =>
      new Map(
        availableCells.map((cell) => [
          cell.date,
          SCHEDULE_DAY_SHORT_LABELS[cell.dayOfWeek],
        ]),
      ),
    [availableCells],
  );

  const cellsOfDay = useMemo(
    () => availableCells.filter((cell) => cell.date === selectedDate),
    [availableCells, selectedDate],
  );

  const range = data
    ? { from: data.from, to: data.to }
    : getWeekRange(parseISODate(week));

  // INFO: Hacia atrás no se navega: los días pasados nunca admiten recuperación.
  const canGoBack = week > getWeekRange(new Date()).from;

  function goToWeek(amount: number) {
    setWeek((current) =>
      formatDateToISO(addWeeks(parseISODate(current), amount)),
    );
    setSelectedDate(null);
    setSelectedCell(null);
  }

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedCell(null);
  }

  function handleSubmit() {
    if (!selectedCell) return;

    mutation.mutate(
      {
        dto: {
          timeSlotId: selectedCell.slot.id,
          memberId: mode.member.id,
          date: selectedCell.date,
        },
        memberName: formatMemberFullName(mode.member),
        slotLabel: formatSlotLabel(selectedCell),
      },
      { onSuccess: onClose },
    );
  }

  return (
    <div className="flex flex-col gap-4 px-6 py-5">
      <SummaryRow label="Alumno" value={formatMemberFullName(mode.member)} />

      <WeekPicker
        rangeLabel={formatWeekRange(range.from, range.to)}
        canGoBack={canGoBack}
        onPrevious={() => goToWeek(-1)}
        onNext={() => goToWeek(1)}
      />

      {isLoading && <ListState kind="loading" message="Cargando horarios" />}

      {!isLoading && dates.length === 0 && (
        <ListState
          kind="empty"
          icon={<RotateCcw size={18} aria-hidden="true" />}
          message="No hay días disponibles en esta semana"
          description="Probá con la semana siguiente."
        />
      )}

      {!isLoading && dates.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
              Día
            </span>

            <DayOptions
              dates={dates}
              dayLabels={dayLabels}
              selectedDate={selectedDate}
              onSelect={handleSelectDate}
            />
          </div>

          {selectedDate && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                Horario
              </span>

              <SlotOptions
                cells={cellsOfDay}
                selectedId={selectedCell?.id ?? null}
                onSelect={setSelectedCell}
              />
            </div>
          )}
        </>
      )}

      <ModalFooter
        onClose={onClose}
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        isDisabled={!selectedCell}
      />
    </div>
  );
}

interface RecoveryTurnModalProps {
  open: boolean;
  onClose: () => void;
  mode: RecoveryTurnMode;
  weekDate: string;
}

export function RecoveryTurnModal({
  open,
  onClose,
  mode,
  weekDate,
}: RecoveryTurnModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Turno de recuperación"
      size="md"
    >
      {mode.kind === "cell" ? (
        <RecoveryByCell mode={mode} weekDate={weekDate} onClose={onClose} />
      ) : (
        <RecoveryByMember mode={mode} weekDate={weekDate} onClose={onClose} />
      )}
    </Modal>
  );
}

RecoveryTurnModal.displayName = "RecoveryTurnModal";
