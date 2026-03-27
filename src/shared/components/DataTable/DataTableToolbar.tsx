import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  SlidersHorizontal,
  EllipsisVertical,
  FileText,
  FileSpreadsheet,
  X,
} from "lucide-react";
import {
  Button,
  SearchInput,
  Popover,
  PopoverItem,
  PopoverSeparator,
  FilterDropdown,
} from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";

export interface DataTableToolbarProps {
  filters: ToolbarFilterConfig[];
  searchPlaceholder?: string;
  onSearch: (value: string) => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  onClearAll?: () => void;
  moreFiltersContent?: ReactNode;
  className?: string;
}

interface ActiveChip {
  filterKey: string;
  filterLabel: string;
  value: string;
  valueLabel: string;
  onChange: (selected: string[]) => void;
  currentSelected: string[];
}

export function DataTableToolbar({
  filters,
  searchPlaceholder = "Buscar...",
  onSearch,
  onExportPdf,
  onExportExcel,
  onClearAll,
  moreFiltersContent,
  className,
}: DataTableToolbarProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  const hasOverflow = Boolean(onExportPdf || onExportExcel);

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

  const hasActiveFilters = activeChips.length > 0;

  function handleRemoveChip(chip: ActiveChip) {
    const next = chip.currentSelected.filter((v) => v !== chip.value);
    chip.onChange(next);
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-row gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <FilterDropdown
              key={filter.key}
              label={filter.label}
              options={filter.options}
              selected={filter.selected}
              onChange={filter.onChange}
              multiple={filter.multiple}
              searchable={filter.searchable}
            />
          ))}

          {moreFiltersContent != null && (
            <Popover
              open={moreFiltersOpen}
              onClose={() => setMoreFiltersOpen(false)}
              side="bottom"
              align="start"
              trigger={
                <Button
                  variant="outline"
                  intent="neutral"
                  onClick={() => setMoreFiltersOpen((prev) => !prev)}
                  aria-label="Mas filtros"
                  className="gap-2"
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  Mas filtros
                </Button>
              }
            >
              <div className="p-3">{moreFiltersContent}</div>
            </Popover>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SearchInput
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            className="flex-1 md:w-64 md:flex-initial"
          />

          {hasOverflow && (
            <Popover
              open={moreOpen}
              onClose={() => setMoreOpen(false)}
              side="bottom"
              align="end"
              trigger={
                <Button
                  variant="ghost"
                  intent="neutral"
                  size="icon"
                  onClick={() => setMoreOpen((prev) => !prev)}
                  aria-label="Mas opciones"
                >
                  <EllipsisVertical size={16} aria-hidden="true" />
                </Button>
              }
            >
              {onExportPdf && (
                <PopoverItem
                  icon={<FileText size={16} color="red" />}
                  onClick={() => {
                    onExportPdf();
                    setMoreOpen(false);
                  }}
                >
                  Exportar a PDF
                </PopoverItem>
              )}
              {onExportPdf && onExportExcel && <PopoverSeparator />}
              {onExportExcel && (
                <PopoverItem
                  icon={<FileSpreadsheet size={16} color="green" />}
                  onClick={() => {
                    onExportExcel();
                    setMoreOpen(false);
                  }}
                >
                  Exportar a Excel
                </PopoverItem>
              )}
            </Popover>
          )}
        </div>
      </div>

      {hasActiveFilters && (
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
      )}
    </div>
  );
}

DataTableToolbar.displayName = "DataTableToolbar";
