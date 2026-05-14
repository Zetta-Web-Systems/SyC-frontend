import { useId, useMemo } from "react";
import { FilterDropdown, Switch } from "@shared/ui";
import type { FilterOption } from "@shared/types/filters.types";
import type { PainEvolutionPeriodValue } from "../../constants/painEvolution";
import type { FlagOption } from "../../types";
import { PainEvolutionPeriodSelector } from "./PainEvolutionPeriodSelector";

interface PainEvolutionFiltersProps {
  period: PainEvolutionPeriodValue;
  onPeriodChange: (value: PainEvolutionPeriodValue) => void;
  flagOptions: FlagOption[];
  selectedFlagIds: string[];
  onSelectedFlagIdsChange: (ids: string[]) => void;
  includeInactive: boolean;
  onIncludeInactiveChange: (value: boolean) => void;
}

const FLAG_DROPDOWN_LABEL = "Banderas";

export function PainEvolutionFilters({
  period,
  onPeriodChange,
  flagOptions,
  selectedFlagIds,
  onSelectedFlagIdsChange,
  includeInactive,
  onIncludeInactiveChange,
}: PainEvolutionFiltersProps) {
  const includeInactiveId = useId();

  const dropdownOptions = useMemo<FilterOption[]>(
    () =>
      flagOptions.map((flag) => ({
        value: flag.id,
        label: flag.isActive ? flag.name : `${flag.name} (inactiva)`,
      })),
    [flagOptions],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {flagOptions.length > 0 && (
        <FilterDropdown
          label={
            selectedFlagIds.length > 0
              ? `${FLAG_DROPDOWN_LABEL} (${selectedFlagIds.length})`
              : FLAG_DROPDOWN_LABEL
          }
          options={dropdownOptions}
          selected={selectedFlagIds}
          onChange={onSelectedFlagIdsChange}
        />
      )}

      <label
        htmlFor={includeInactiveId}
        className="flex items-center gap-2 text-xs text-neutral-600"
      >
        <span>Incluir inactivas</span>
        <Switch
          id={includeInactiveId}
          checked={includeInactive}
          onChange={(event) => onIncludeInactiveChange(event.target.checked)}
          size="sm"
        />
      </label>

      <PainEvolutionPeriodSelector value={period} onChange={onPeriodChange} />
    </div>
  );
}

PainEvolutionFilters.displayName = "PainEvolutionFilters";
