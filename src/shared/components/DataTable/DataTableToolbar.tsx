import { useState } from "react";
import type { ReactNode } from "react";
import {
  SlidersHorizontal,
  EllipsisVertical,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import {
  Button,
  SearchInput,
  Popover,
  PopoverItem,
  PopoverSeparator,
} from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { ToolbarTab } from "@shared/types/datatable.types";

export interface DataTableToolbarProps {
  tabs: ToolbarTab[];
  activeTab: string;
  searchPlaceholder?: string;
  onTabChange: (value: string) => void;
  onSearch: (value: string) => void;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  className?: string;
  filterContent?: ReactNode;
}

export function DataTableToolbar({
  tabs,
  activeTab,
  searchPlaceholder = "Buscar...",
  onTabChange,
  onSearch,
  onExportPdf,
  onExportExcel,
  className,
  filterContent,
}: DataTableToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const hasOverflow = Boolean(onExportPdf || onExportExcel);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3",
        className,
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav
          role="tablist"
          className="hidden gap-1 overflow-x-auto scrollbar-hide sm:flex md:border-b-0"
        >
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            return (
              <Button
                key={tab.value}
                role="tab"
                variant={isActive ? "solid" : "outline"}
                aria-selected={isActive}
                onClick={() => onTabChange(tab.value)}
              >
                {tab.label}
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SearchInput
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            className="flex-1 md:w-64 md:flex-initial"
          />

          {filterContent != null && (
            <Popover
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              side="bottom"
              align="end"
              trigger={
                <Button
                  variant="outline"
                  intent="neutral"
                  size="icon"
                  onClick={() => setFilterOpen((prev) => !prev)}
                  aria-label="Filtros"
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                </Button>
              }
            >
              <div className="p-3">{filterContent}</div>
            </Popover>
          )}

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
    </div>
  );
}

DataTableToolbar.displayName = "DataTableToolbar";
