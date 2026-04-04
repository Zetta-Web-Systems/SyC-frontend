import { useMemo } from "react";
import { X } from "lucide-react";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";

interface ActiveChip {
  filterKey: string;
  filterLabel: string;
  value: string;
  valueLabel: string;
  onChange: (selected: string[]) => void;
  currentSelected: string[];
}

interface ActiveFilterChipsProps {
  filters: ToolbarFilterConfig[];
  onClearAll?: () => void;
}

export function ActiveFilterChips({
  filters,
  onClearAll,
}: ActiveFilterChipsProps) {
  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = [];
    for (const filter of filters) {
      for (const selectedValue of filter.selected) {
        const option = filter.options.find((o) => o.value === selectedValue);
        if (option) {
          chips.push({
            filterKey: filter.key,
            filterLabel: filter.label,
            value: selectedValue,
            valueLabel: option.label,
            onChange: filter.onChange,
            currentSelected: filter.selected,
          });
        }
      }
    }
    return chips;
  }, [filters]);

  if (activeChips.length === 0) return null;

  function handleRemoveChip(chip: ActiveChip) {
    const next = chip.currentSelected.filter((v) => v !== chip.value);
    chip.onChange(next);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeChips.map((chip) => (
        <span
          key={`${chip.filterKey}-${chip.value}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700"
        >
          {chip.filterLabel}: {chip.valueLabel}
          <button
            type="button"
            onClick={() => handleRemoveChip(chip)}
            className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-primary-100"
            aria-label={`Quitar filtro ${chip.filterLabel}: ${chip.valueLabel}`}
          >
            <X size={12} aria-hidden="true" />
          </button>
        </span>
      ))}

      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="cursor-pointer text-xs font-medium text-primary-600 transition-colors hover:text-primary-800"
        >
          Limpiar todo
        </button>
      )}
    </div>
  );
}

ActiveFilterChips.displayName = "ActiveFilterChips";
