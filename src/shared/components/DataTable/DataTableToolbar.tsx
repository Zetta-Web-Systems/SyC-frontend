import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Badge,
  Button,
  SearchInput,
  Popover,
  FilterDropdown,
  DateFilterDropdown,
} from "@shared/ui";
import type { DateFilterDropdownProps } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type {
  ToolbarFilterConfig,
  ExtraFilterChip,
} from "@shared/types/datatable.types";
import { ActiveFilterChips } from "./Toolbar/ActiveFilterChips";
import { ExportMenu } from "./Toolbar/ExportMenu";

export interface DataTableToolbarProps {
  filters: ToolbarFilterConfig[];
  dateFilter?: Omit<DateFilterDropdownProps, "className">;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch: (value: string) => void;
  onSearchClear?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onClearAll?: () => void;
  extraChips?: ExtraFilterChip[];
  moreFiltersContent?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function DataTableToolbar({
  filters,
  dateFilter,
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearch,
  onSearchClear,
  onExportPDF,
  onExportExcel,
  onClearAll,
  extraChips: consumerExtraChips,
  moreFiltersContent,
  actions,
  className,
}: DataTableToolbarProps) {
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const builtExtraChips = useMemo<ExtraFilterChip[]>(() => {
    const chips: ExtraFilterChip[] = [];

    if (dateFilter?.value) {
      chips.push({
        key: "__date",
        label: dateFilter.label,
        value: dateFilter.value.toLocaleDateString("es-AR"),
        onRemove: () => dateFilter.onChange(null),
      });
    }

    if (searchValue) {
      chips.push({
        key: "__search",
        label: "Búsqueda",
        value: searchValue,
        onRemove: () => onSearchClear?.(),
      });
    }

    if (consumerExtraChips) {
      chips.push(...consumerExtraChips);
    }

    return chips;
  }, [dateFilter, searchValue, onSearchClear, consumerExtraChips]);

  const activeFilterCount =
    filters.reduce((sum, f) => sum + f.selected.length, 0) +
    builtExtraChips.length;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-row gap-3 justify-between">
        {/* Desktop */}
        <div className="hidden md:flex flex-wrap items-center gap-2">
          {dateFilter && (
            <DateFilterDropdown
              label={dateFilter.label}
              value={dateFilter.value}
              onChange={dateFilter.onChange}
            />
          )}

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

        {/* Mobile */}
        <div className="flex items-center md:hidden">
          <Popover
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            side="bottom"
            align="start"
            className="w-79 p-0"
            trigger={
              <Button
                variant="outline"
                intent="neutral"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
                className="gap-2"
              >
                <SlidersHorizontal size={16} aria-hidden="true" />
                Filtros
                {activeFilterCount > 0 && (
                  <Badge intent="info" size="sm">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            }
          >
            <div className="flex flex-row gap-3 p-3">
              {dateFilter && (
                <DateFilterDropdown
                  label={dateFilter.label}
                  value={dateFilter.value}
                  onChange={dateFilter.onChange}
                />
              )}

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

              {onClearAll && activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  intent="primary"
                  onClick={() => {
                    onClearAll();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full cursor-pointer text-center text-xs font-medium text-primary-600 transition-colors hover:text-primary-800"
                >
                  Limpiar todo
                </Button>
              )}
            </div>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <SearchInput
            placeholder={searchPlaceholder}
            externalValue={searchValue}
            onSearch={onSearch}
            className="flex-1 md:w-64 md:flex-initial"
          />

          {actions}

          <ExportMenu onExportPDF={onExportPDF} onExportExcel={onExportExcel} />
        </div>
      </div>

      <ActiveFilterChips
        filters={filters}
        extraChips={builtExtraChips}
        onClearAll={onClearAll}
      />
    </div>
  );
}

DataTableToolbar.displayName = "DataTableToolbar";
