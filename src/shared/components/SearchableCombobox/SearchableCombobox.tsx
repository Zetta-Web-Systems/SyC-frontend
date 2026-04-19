import type { ReactNode } from "react";
import { SearchInput } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { useSearchableCombobox } from "./useSearchableCombobox";

interface SearchableComboboxProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  excludeIds?: string[];
  placeholder?: string;
  listboxId?: string;
  searchDelay?: number;
  minQueryToCreate?: number;
  onSelect: (item: T) => void;
  onCreate?: (query: string) => void;
  renderItem?: (args: { item: T; active: boolean }) => ReactNode;
  renderCreateOption?: (args: { query: string; active: boolean }) => ReactNode;
}

export function SearchableCombobox<T>({
  items,
  getKey,
  getLabel,
  excludeIds,
  placeholder = "Buscar...",
  listboxId = "searchable-combobox-listbox",
  searchDelay = 0,
  minQueryToCreate = 2,
  onSelect,
  onCreate,
  renderItem,
  renderCreateOption,
}: SearchableComboboxProps<T>) {
  const {
    containerRef,
    query,
    isOpen,
    activeIndex,
    filtered,
    showCreateOption,
    externalValue,
    onSearch,
    onKeyDown,
    onFocusCapture,
    selectItem,
    handleCreate,
  } = useSearchableCombobox({
    items,
    getKey,
    getLabel,
    excludeIds,
    onSelect,
    onCreate,
    minQueryToCreate,
  });

  const totalItems = filtered.length + (showCreateOption ? 1 : 0);

  return (
    <div
      ref={containerRef}
      className="relative"
      onFocusCapture={onFocusCapture}
      onKeyDownCapture={onKeyDown}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns={listboxId}
    >
      <SearchInput
        placeholder={placeholder}
        onSearch={onSearch}
        externalValue={externalValue}
        delay={searchDelay}
      />

      {isOpen && totalItems > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {filtered.map((item, i) => {
            const active = activeIndex === i;
            return (
              <li
                key={getKey(item)}
                role="option"
                aria-selected={active}
                className="cursor-default"
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => selectItem(item)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-50",
                  )}
                >
                  {renderItem ? (
                    renderItem({ item, active })
                  ) : (
                    <span className="font-medium">{getLabel(item)}</span>
                  )}
                </button>
              </li>
            );
          })}

          {showCreateOption && (
            <li
              role="option"
              aria-selected={activeIndex === filtered.length}
              className="cursor-default"
            >
              <button
                type="button"
                tabIndex={-1}
                onClick={handleCreate}
                className={cn(
                  "flex w-full items-center gap-2 border-t border-neutral-100 px-3 py-2.5 text-sm font-medium transition-colors",
                  activeIndex === filtered.length
                    ? "bg-primary-50 text-primary-700"
                    : "text-primary-600 hover:bg-primary-50",
                )}
              >
                {renderCreateOption ? (
                  renderCreateOption({
                    query,
                    active: activeIndex === filtered.length,
                  })
                ) : (
                  <span>Crear &ldquo;{query}&rdquo;</span>
                )}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
