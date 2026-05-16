import { useState, useMemo, useEffect, useId } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import { Popover } from "@shared/ui/Popover/Popover";
import { Input } from "@shared/ui/Input/Input";
import { Spinner } from "@shared/ui/Spinner/Spinner";
import { cn } from "@shared/lib/cn";

export interface SearchableSelectProps<T> {
  value: T | null;
  onChange: (item: T | null) => void;
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderItem?: (item: T) => ReactNode;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  onCreate?: (query: string) => void;
  createLabel?: (query: string) => string;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  "aria-describedby"?: string;
  className?: string;
  clearable?: boolean;
  maxVisibleItems?: number;
  renderTrigger?: (state: {
    open: boolean;
    toggle: () => void;
    value: T | null;
    label: string;
    disabled?: boolean;
  }) => ReactNode;
}

export function SearchableSelect<T>({
  value,
  onChange,
  items,
  getKey,
  getLabel,
  renderItem,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Sin resultados",
  isLoading,
  onSearch,
  onCreate,
  createLabel,
  disabled,
  error,
  id,
  "aria-describedby": ariaDescribedBy,
  className,
  clearable = true,
  maxVisibleItems,
  renderTrigger,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const isAsync = !!onSearch;

  const filtered = useMemo(() => {
    if (isAsync) return items;
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) => getLabel(item).toLowerCase().includes(q));
  }, [items, search, getLabel, isAsync]);

  const showCreateOption =
    !!onCreate &&
    !!search.trim() &&
    !filtered.some((it) => getLabel(it) === search);

  const totalOptions = filtered.length + (showCreateOption ? 1 : 0);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
  }, [open, search]);

  useEffect(() => {
    if (!isAsync) return;
    onSearch?.(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onSearch identity-stable from caller
  }, [search]);

  function handleClose() {
    setOpen(false);
    setSearch("");
  }

  function handleSelect(item: T) {
    onChange(item);
    handleClose();
  }

  function handleCreate() {
    if (!onCreate || !search.trim()) return;
    onCreate(search);
    handleClose();
  }

  function handleClear(e: MouseEvent) {
    e.stopPropagation();
    onChange(null);
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(totalOptions - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex < filtered.length) {
        const item = filtered[activeIndex];
        if (item) handleSelect(item);
      } else if (showCreateOption) {
        handleCreate();
      }
    }
  }

  const triggerLabel = value ? getLabel(value) : placeholder;
  const hasValue = !!value;
  const showClearButton = clearable && hasValue && !disabled;

  const toggleOpen = () => !disabled && setOpen((p) => !p);

  const defaultTrigger = (
    <button
      type="button"
      id={triggerId}
      disabled={disabled}
      onClick={toggleOpen}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-invalid={error || undefined}
      aria-describedby={ariaDescribedBy}
      data-invalid={error ? "true" : undefined}
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 text-sm font-medium outline-none transition-all focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-error bg-error/5 focus:border-error focus:ring-error/10"
          : "border-neutral-300 focus:border-primary-500 focus:ring-primary-500/10",
        !hasValue && "text-neutral-400 font-normal",
        hasValue && "text-neutral-900",
        !disabled && "cursor-pointer",
      )}
    >
      <span className="truncate text-left">{triggerLabel}</span>
      <span className="flex shrink-0 items-center gap-1 text-neutral-400">
        {showClearButton && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Limpiar selección"
            onClick={handleClear}
            className="flex items-center rounded p-0.5 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <X size={14} aria-hidden="true" />
          </span>
        )}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn("transition-transform", open && "rotate-180")}
        />
      </span>
    </button>
  );

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <Popover
        open={open}
        onClose={handleClose}
        side="bottom"
        align="start"
        className={cn("min-w-72 p-0", className)}
        trigger={
          renderTrigger
            ? renderTrigger({
                open,
                toggle: toggleOpen,
                value,
                label: triggerLabel,
                disabled,
              })
            : defaultTrigger
        }
      >
        <div className="flex w-72 flex-col">
          <div className="border-b border-neutral-100 p-3">
            <Input
              autoFocus
              value={search}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              size="sm"
              leftElement={<Search size={14} aria-hidden="true" />}
            />
          </div>

          <ul
            id={listboxId}
            role="listbox"
            className={cn(
              "overflow-y-auto p-1",
              maxVisibleItems === undefined && "max-h-56",
            )}
            style={
              maxVisibleItems !== undefined
                ? { maxHeight: `${maxVisibleItems * 2.5}rem` }
                : undefined
            }
          >
            {isLoading && (
              <li className="flex items-center justify-center px-3 py-3">
                <Spinner size="sm" />
              </li>
            )}

            {!isLoading && filtered.length === 0 && !showCreateOption && (
              <li className="px-3 py-2 text-sm text-neutral-400">
                {emptyMessage}
              </li>
            )}

            {!isLoading &&
              filtered.map((item, i) => {
                const isActive = activeIndex === i;
                const isSelected = value && getKey(value) === getKey(item);
                return (
                  <li
                    key={getKey(item)}
                    role="option"
                    aria-selected={!!isSelected}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        isActive && "bg-neutral-50",
                        isSelected
                          ? "bg-primary-50 font-medium text-primary-800"
                          : "text-neutral-700",
                      )}
                    >
                      {renderItem ? (
                        renderItem(item)
                      ) : (
                        <span>{getLabel(item)}</span>
                      )}
                    </button>
                  </li>
                );
              })}

            {!isLoading && showCreateOption && (
              <li
                role="option"
                aria-selected={activeIndex === filtered.length}
                className="border-t border-neutral-100"
              >
                <button
                  type="button"
                  onClick={handleCreate}
                  onMouseEnter={() => setActiveIndex(filtered.length)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    activeIndex === filtered.length
                      ? "bg-primary-50 text-primary-700"
                      : "text-primary-600 hover:bg-primary-50",
                  )}
                >
                  <Plus size={14} aria-hidden="true" />
                  <span>
                    {createLabel ? createLabel(search) : `Crear "${search}"`}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </Popover>
    </div>
  );
}

SearchableSelect.displayName = "SearchableSelect";
