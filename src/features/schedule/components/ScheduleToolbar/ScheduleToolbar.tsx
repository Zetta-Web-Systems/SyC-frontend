import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Users,
} from "lucide-react";
import { Button, SearchInput } from "@shared/ui";
import { cn } from "@shared/lib/cn";

interface WeekNavigatorProps {
  rangeLabel: string;
  isCurrentWeek: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

function WeekNavigator({
  rangeLabel,
  isCurrentWeek,
  onPrevious,
  onNext,
  onToday,
}: WeekNavigatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-xl border border-neutral-300 bg-white p-1">
        <Button
          variant="ghost"
          intent="neutral"
          size="icon"
          aria-label="Semana anterior"
          onClick={onPrevious}
          className="size-8"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>

        <span className="min-w-34 text-center text-[13.5px] font-semibold text-neutral-800">
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

      {!isCurrentWeek && (
        <Button variant="ghost" intent="primary" size="sm" onClick={onToday}>
          Hoy
        </Button>
      )}
    </div>
  );
}

interface MemberSearchProps {
  onSearch: (value: string) => void;
  isSearching: boolean;
  memberCount: number;
  slotCount: number;
}

function buildSearchSummary(memberCount: number, slotCount: number): string {
  if (memberCount === 0) return "Nadie coincide esta semana";

  const slots = slotCount === 1 ? "1 horario" : `${slotCount} horarios`;
  if (memberCount === 1) return `Anotado en ${slots}`;

  return `${memberCount} alumnos en ${slots}`;
}

function MemberSearch({
  onSearch,
  isSearching,
  memberCount,
  slotCount,
}: MemberSearchProps) {
  return (
    <div className="flex flex-col gap-1">
      <SearchInput
        placeholder="Buscar alumno"
        onSearch={onSearch}
        className="w-full sm:w-60"
      />

      {isSearching && (
        <p
          role="status"
          className={cn(
            "px-1 text-[11px] font-medium",
            memberCount > 0 ? "text-primary-600" : "text-neutral-400",
          )}
        >
          {buildSearchSummary(memberCount, slotCount)}
        </p>
      )}
    </div>
  );
}

interface ExpandAllToggleProps {
  areAllExpanded: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

function ExpandAllToggle({
  areAllExpanded,
  onExpandAll,
  onCollapseAll,
}: ExpandAllToggleProps) {
  return (
    <div
      role="group"
      aria-label="Vista de los horarios"
      className="flex h-10 items-center gap-0.5 rounded-xl border border-neutral-300 bg-white px-1"
    >
      <Button
        variant={areAllExpanded ? "solid" : "ghost"}
        intent={areAllExpanded ? "primary" : "neutral"}
        size="icon"
        aria-pressed={areAllExpanded}
        aria-label="Expandir todos los horarios"
        title="Expandir todos los horarios"
        onClick={onExpandAll}
        className="size-7"
      >
        <ChevronsUpDown size={14} aria-hidden="true" />
      </Button>

      <Button
        variant={areAllExpanded ? "ghost" : "solid"}
        intent={areAllExpanded ? "neutral" : "primary"}
        size="icon"
        aria-pressed={!areAllExpanded}
        aria-label="Colapsar todos los horarios"
        title="Colapsar todos los horarios"
        onClick={onCollapseAll}
        className="size-7"
      >
        <ChevronsDownUp size={14} aria-hidden="true" />
      </Button>
    </div>
  );
}

interface WeekendToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

function WeekendToggle({ isVisible, onToggle }: WeekendToggleProps) {
  return (
    <Button
      variant="outline"
      intent={isVisible ? "primary" : "neutral"}
      size="md"
      aria-pressed={isVisible}
      title={
        isVisible ? "Ocultar sábado y domingo" : "Mostrar sábado y domingo"
      }
      onClick={onToggle}
      className={cn("rounded-xl", isVisible && "bg-primary-50")}
    >
      <CalendarDays size={15} aria-hidden="true" />
      Fin de semana
    </Button>
  );
}

interface UnassignedToggleProps {
  isOpen: boolean;
  count: number;
  onToggle: () => void;
}

function UnassignedToggle({ isOpen, count, onToggle }: UnassignedToggleProps) {
  return (
    <Button
      variant="outline"
      intent={isOpen ? "primary" : "neutral"}
      size="md"
      aria-pressed={isOpen}
      onClick={onToggle}
      className={cn("rounded-xl", isOpen && "bg-primary-50")}
    >
      <Users size={15} aria-hidden="true" />
      Sin asignar
      <span
        className={cn(
          "rounded-full px-1.5 py-px text-[10.5px] font-bold",
          isOpen
            ? "bg-primary-100 text-primary-700"
            : "bg-neutral-100 text-neutral-600",
        )}
      >
        {count}
      </span>
    </Button>
  );
}

interface ScheduleToolbarProps {
  rangeLabel: string;
  isCurrentWeek: boolean;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  onMemberSearch: (value: string) => void;
  isSearching: boolean;
  matchedMemberCount: number;
  matchedSlotCount: number;
  areAllExpanded: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  isUnassignedOpen: boolean;
  unassignedCount: number;
  onToggleUnassigned: () => void;
  isWeekendVisible: boolean;
  onToggleWeekend: () => void;
}

export function ScheduleToolbar({
  rangeLabel,
  isCurrentWeek,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  onMemberSearch,
  isSearching,
  matchedMemberCount,
  matchedSlotCount,
  areAllExpanded,
  onExpandAll,
  onCollapseAll,
  isUnassignedOpen,
  unassignedCount,
  onToggleUnassigned,
  isWeekendVisible,
  onToggleWeekend,
}: ScheduleToolbarProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-wrap items-start gap-3">
        <WeekNavigator
          rangeLabel={rangeLabel}
          isCurrentWeek={isCurrentWeek}
          onPrevious={onPreviousWeek}
          onNext={onNextWeek}
          onToday={onCurrentWeek}
        />

        <MemberSearch
          onSearch={onMemberSearch}
          isSearching={isSearching}
          memberCount={matchedMemberCount}
          slotCount={matchedSlotCount}
        />
      </div>

      <div className="flex items-center gap-2">
        <ExpandAllToggle
          areAllExpanded={areAllExpanded}
          onExpandAll={onExpandAll}
          onCollapseAll={onCollapseAll}
        />

        <WeekendToggle
          isVisible={isWeekendVisible}
          onToggle={onToggleWeekend}
        />

        <UnassignedToggle
          isOpen={isUnassignedOpen}
          count={unassignedCount}
          onToggle={onToggleUnassigned}
        />
      </div>
    </div>
  );
}

ScheduleToolbar.displayName = "ScheduleToolbar";
