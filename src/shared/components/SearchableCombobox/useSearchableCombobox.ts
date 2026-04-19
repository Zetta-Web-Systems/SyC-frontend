import { useCallback, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useClickOutside } from "@shared/hooks/useClickOutside";

interface UseSearchableComboboxParams<T> {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  excludeIds?: string[];
  onSelect: (item: T) => void;
  onCreate?: (query: string) => void;
  minQueryToCreate?: number;
}

export function useSearchableCombobox<T>({
  items,
  getKey,
  getLabel,
  excludeIds,
  onSelect,
  onCreate,
  minQueryToCreate = 2,
}: UseSearchableComboboxParams<T>) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [externalValue, setExternalValue] = useState<string | undefined>(
    undefined,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  useClickOutside(containerRef, close);

  const excludeSet = useMemo(() => new Set(excludeIds ?? []), [excludeIds]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        !excludeSet.has(getKey(item)) &&
        getLabel(item).toLowerCase().includes(q),
    );
  }, [items, excludeSet, getKey, getLabel, query]);

  const hasExactMatch = useMemo(
    () =>
      filtered.some(
        (item) => getLabel(item).toLowerCase() === query.toLowerCase(),
      ),
    [filtered, getLabel, query],
  );

  const showCreateOption =
    !!onCreate && query.length >= minQueryToCreate && !hasExactMatch;
  const totalItems = filtered.length + (showCreateOption ? 1 : 0);

  const onSearch = useCallback((value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0);
    setActiveIndex(-1);
    setExternalValue(undefined);
  }, []);

  const selectItem = useCallback(
    (item: T) => {
      onSelect(item);
      setQuery("");
      setExternalValue("");
      close();
    },
    [onSelect, close],
  );

  const handleCreate = useCallback(() => {
    if (!onCreate) return;
    onCreate(query);
    setQuery("");
    setExternalValue("");
    close();
  }, [onCreate, query, close]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || totalItems === 0) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % totalItems);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < filtered.length) {
            selectItem(filtered[activeIndex]);
          } else if (activeIndex === filtered.length && showCreateOption) {
            handleCreate();
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          close();
          break;
        }
      }
    },
    [
      isOpen,
      totalItems,
      activeIndex,
      filtered,
      showCreateOption,
      selectItem,
      handleCreate,
      close,
    ],
  );

  const onFocusCapture = useCallback(() => {
    if (query.length > 0) setIsOpen(true);
  }, [query]);

  return {
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
  };
}
