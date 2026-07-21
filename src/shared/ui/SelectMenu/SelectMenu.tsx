import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent, ReactNode, Ref } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { useDropdown } from "@shared/hooks/useDropdown";
import { DropdownPanel } from "@shared/components/DropdownPanel";
import {
  selectMenuOptionVariants,
  selectMenuTriggerVariants,
} from "./SelectMenu.variants";

export interface SelectMenuOption<T> {
  value: T;
  label: ReactNode;
  optionLabel?: ReactNode;
  triggerLabel?: ReactNode;
  icon?: ReactNode;
  endAdornment?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  searchKey?: string;
}

export type SelectMenuVariant = "input" | "ghost" | "unstyled";
export type SelectMenuSize = "sm" | "md" | "lg";

export interface SelectMenuProps<T extends string | number> {
  ref?: Ref<HTMLButtonElement>;
  value: T | null;
  onChange: (next: T) => void;
  options: SelectMenuOption<T>[];
  variant?: SelectMenuVariant;
  size?: SelectMenuSize;
  placeholder?: string;
  renderTrigger?: (selected: SelectMenuOption<T> | null) => ReactNode;
  hideChevron?: boolean;
  id?: string;
  name?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  panelWidth?: "trigger" | "auto" | string;
  panelClassName?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  triggerClassName?: string;
  className?: string;
}

function optionSearchKey<T>(opt: SelectMenuOption<T>): string {
  if (opt.searchKey) return opt.searchKey;
  if (typeof opt.label === "string") return opt.label;
  if (typeof opt.triggerLabel === "string") return opt.triggerLabel;
  return String(opt.value);
}

function findNextEnabled<T>(
  options: SelectMenuOption<T>[],
  from: number,
  direction: 1 | -1,
): number {
  if (options.length === 0) return -1;
  const len = options.length;
  let i = from;
  for (let step = 0; step < len; step++) {
    i = (i + direction + len) % len;
    if (!options[i].disabled) return i;
  }
  return -1;
}

function findByPrefix<T>(
  options: SelectMenuOption<T>[],
  prefix: string,
  startFrom: number,
): number {
  if (!prefix) return -1;
  const lc = prefix.toLowerCase();
  const len = options.length;
  for (let step = 1; step <= len; step++) {
    const i = (startFrom + step) % len;
    const opt = options[i];
    if (opt.disabled) continue;
    if (optionSearchKey(opt).toLowerCase().startsWith(lc)) return i;
  }
  return -1;
}

export function SelectMenu<T extends string | number>({
  ref,
  value,
  onChange,
  options,
  variant = "input",
  size = "md",
  placeholder = "Seleccionar",
  renderTrigger,
  hideChevron = false,
  id,
  name,
  error,
  errorMessage,
  disabled = false,
  panelWidth,
  panelClassName,
  ariaLabel,
  ariaLabelledBy,
  triggerClassName,
  className,
}: SelectMenuProps<T>) {
  const reactId = useId();
  const listboxId = `${id ?? reactId}-listbox`;
  const errorId = errorMessage ? `${id ?? reactId}-error` : undefined;

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value],
  );

  const { isOpen, open, close, containerRef } = useDropdown<HTMLDivElement>({
    closeOnEscape: false,
  });

  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeBufferRef = useRef<string>("");
  const typeTimerRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const externalRef = ref;

  useEffect(() => {
    if (!externalRef) return;
    if (typeof externalRef === "function") {
      externalRef(triggerRef.current);
    } else {
      externalRef.current = triggerRef.current;
    }
  }, [externalRef]);

  const initialHighlight = useCallback((): number => {
    if (selectedIndex >= 0 && !options[selectedIndex].disabled) {
      return selectedIndex;
    }
    return findNextEnabled(options, -1, 1);
  }, [options, selectedIndex]);

  const openMenu = useCallback(
    (highlightOverride?: number) => {
      open();
      setHighlightedIndex(
        highlightOverride !== undefined
          ? highlightOverride
          : initialHighlight(),
      );
    },
    [open, initialHighlight],
  );

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, highlightedIndex]);

  const commit = useCallback(
    (index: number) => {
      const opt = options[index];
      if (!opt || opt.disabled) return;
      if (opt.value !== value) onChange(opt.value);
      close();
      triggerRef.current?.focus();
    },
    [options, value, onChange, close],
  );

  const scheduleClearBuffer = useCallback(() => {
    if (typeTimerRef.current !== null) {
      window.clearTimeout(typeTimerRef.current);
    }
    typeTimerRef.current = window.setTimeout(() => {
      typeBufferRef.current = "";
      typeTimerRef.current = null;
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (typeTimerRef.current !== null) {
        window.clearTimeout(typeTimerRef.current);
      }
    };
  }, []);

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (!isOpen) {
      if (
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp"
      ) {
        e.preventDefault();
        openMenu();
        return;
      }
      if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        typeBufferRef.current += e.key;
        scheduleClearBuffer();
        const match = findByPrefix(options, typeBufferRef.current, -1);
        openMenu(match >= 0 ? match : undefined);
        return;
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "Tab") {
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => findNextEnabled(options, prev, 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => findNextEnabled(options, prev, -1));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setHighlightedIndex(findNextEnabled(options, -1, 1));
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setHighlightedIndex(findNextEnabled(options, options.length, -1));
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlightedIndex >= 0) commit(highlightedIndex);
      return;
    }
    if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      typeBufferRef.current += e.key;
      scheduleClearBuffer();
      const next = findByPrefix(
        options,
        typeBufferRef.current,
        highlightedIndex,
      );
      if (next >= 0) setHighlightedIndex(next);
    }
  }

  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;
  const hasError = error ?? !!errorMessage;

  const triggerContent = renderTrigger ? (
    renderTrigger(selected)
  ) : (
    <DefaultTrigger selected={selected} placeholder={placeholder} />
  );

  const highlightedOptionId =
    highlightedIndex >= 0 ? `${listboxId}-opt-${highlightedIndex}` : undefined;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        variant === "input"
          ? "inline-flex w-full flex-col gap-1.5"
          : "inline-block",
        className,
      )}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        name={name}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={isOpen ? highlightedOptionId : undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={errorId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-invalid={hasError ? "true" : undefined}
        data-state={isOpen ? "open" : "closed"}
        data-error={hasError ? "true" : undefined}
        onClick={() => (isOpen ? close() : openMenu())}
        onKeyDown={handleKeyDown}
        className={cn(
          selectMenuTriggerVariants({
            variant,
            size,
            isError: hasError,
            isDisabled: disabled,
            isOpen,
          }),
          triggerClassName,
        )}
      >
        {triggerContent}
        {!hideChevron && (
          <ChevronDown
            size={variant === "input" ? 16 : 12}
            aria-hidden="true"
            className={cn(
              "shrink-0 transition-transform",
              variant === "input" ? "text-neutral-400" : "text-neutral-400",
              isOpen && "rotate-180",
              isOpen && variant === "ghost" && "text-primary-500",
            )}
          />
        )}
      </button>

      <DropdownPanel
        open={isOpen}
        side="bottom"
        align="start"
        elevation="md"
        padding="sm"
        width={panelWidth ?? (variant === "input" ? "trigger" : "auto")}
        className={cn(
          variant === "input" ? "top-[calc(100%+4px)]" : "top-[calc(100%+4px)]",
          panelClassName,
        )}
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {options.map((opt, i) => {
          const isSelected = i === selectedIndex;
          const isHighlighted = i === highlightedIndex;
          const state = opt.disabled
            ? "disabled"
            : isSelected && isHighlighted
              ? "selected-highlighted"
              : isSelected
                ? "selected"
                : isHighlighted
                  ? "highlighted"
                  : "default";
          const optionId = `${listboxId}-opt-${i}`;
          return (
            <button
              key={String(opt.value)}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              id={optionId}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={opt.disabled || undefined}
              disabled={opt.disabled}
              onMouseEnter={() => {
                if (!opt.disabled) setHighlightedIndex(i);
              }}
              onClick={() => commit(i)}
              className={selectMenuOptionVariants({ state })}
            >
              {opt.icon && (
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex shrink-0"
                >
                  {opt.icon}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate">
                  {opt.optionLabel ?? opt.label}
                </span>
                {opt.description && (
                  <span className="mt-0.5 block text-[10.5px] font-medium text-neutral-500">
                    {opt.description}
                  </span>
                )}
              </span>
              {opt.endAdornment ? (
                <span className="ml-1 inline-flex shrink-0 items-center">
                  {opt.endAdornment}
                </span>
              ) : isSelected ? (
                <Check
                  size={12}
                  aria-hidden="true"
                  className="ml-1 shrink-0 text-primary-600"
                />
              ) : null}
            </button>
          );
        })}
      </DropdownPanel>

      {errorMessage && (
        <p id={errorId} role="alert" className="text-xs text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

SelectMenu.displayName = "SelectMenu";

interface DefaultTriggerProps<T> {
  selected: SelectMenuOption<T> | null;
  placeholder: string;
}

function DefaultTrigger<T>({ selected, placeholder }: DefaultTriggerProps<T>) {
  if (!selected) {
    return (
      <span className="min-w-0 flex-1 truncate text-left text-neutral-400">
        {placeholder}
      </span>
    );
  }
  const label = selected.triggerLabel ?? selected.label;
  return (
    <>
      {selected.icon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {selected.icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
    </>
  );
}
