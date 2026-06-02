import { useState, useMemo, useCallback } from "react";
import type { ChangeEvent } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Popover } from "@shared/ui/Popover/Popover";
import { Checkbox } from "@shared/ui/Checkbox/Checkbox";
import { Input } from "@shared/ui/Input/Input";
import { cn } from "@shared/lib/cn";
import type { FilterOption } from "@shared/types/filters.types";
import { filterDropdownTriggerVariants } from "./FilterDropdown.variants";

export interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  selected,
  onChange,
  multiple = true,
  searchable = true,
  disabled = false,
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const hasSelection = selected.length > 0;

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const query = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, search]);

  const handleToggle = useCallback(
    (value: string) => {
      if (multiple) {
        const next = selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value];
        onChange(next);
      } else {
        const next = selected.includes(value) ? [] : [value];
        onChange(next);
      }
    },
    [multiple, selected, onChange],
  );

  const handleClearSelected = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  return (
    <Popover
      open={open}
      onClose={handleClose}
      side="bottom"
      align="start"
      className={cn("min-w-60 p-0", className)}
      trigger={
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          disabled={disabled}
          className={filterDropdownTriggerVariants({
            isActive: hasSelection,
          })}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {label}
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={cn("transition-transform", open && "rotate-180")}
          />
        </button>
      }
    >
      <div className="flex flex-col">
        {searchable && (
          <div className="border-b border-neutral-100 p-3">
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar valores"
              size="sm"
              leftElement={<Search size={14} aria-hidden="true" />}
            />
          </div>
        )}

        <ul
          role="listbox"
          aria-multiselectable={multiple}
          className="max-h-56 overflow-y-auto p-1"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-400">
              Sin resultados
            </li>
          ) : (
            filteredOptions.map((option) => {
              const isChecked = selected.includes(option.value);
              return (
                <li key={option.value} role="option" aria-selected={isChecked}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      "hover:bg-neutral-50",
                      isChecked && "bg-primary-50 font-medium text-primary-800",
                    )}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleToggle(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                </li>
              );
            })
          )}
        </ul>

        {hasSelection && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-3 py-2">
            <span className="text-xs text-neutral-500">
              Seleccionados: {selected.length}
            </span>
            <button
              type="button"
              onClick={handleClearSelected}
              className="cursor-pointer text-xs font-medium text-primary-600 transition-colors hover:text-primary-800"
            >
              Limpiar selección
            </button>
          </div>
        )}
      </div>
    </Popover>
  );
}

FilterDropdown.displayName = "FilterDropdown";
