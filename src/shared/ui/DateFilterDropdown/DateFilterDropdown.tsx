import { useRef, useCallback } from "react";
import type { MouseEvent } from "react";
import { Calendar, X } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { filterDropdownTriggerVariants } from "../FilterDropdown/FilterDropdown.variants";

export interface DateFilterDropdownProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

export function DateFilterDropdown({
  label,
  value,
  onChange,
  className,
}: DateFilterDropdownProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value !== null;

  const handleTriggerClick = useCallback(() => {
    inputRef.current?.showPicker();
  }, []);

  const handleClear = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChange(val ? new Date(val + "T00:00:00") : null);
    },
    [onChange],
  );

  return (
    <button
      type="button"
      onClick={handleTriggerClick}
      className={cn(
        filterDropdownTriggerVariants({ isActive: hasValue }),
        "relative",
        className,
      )}
    >
      <Calendar size={16} aria-hidden="true" />
      {hasValue ? value.toLocaleDateString("es-AR") : label}

      {hasValue && (
        <span
          role="button"
          tabIndex={0}
          onClick={handleClear}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onChange(null);
            }
          }}
          className="relative z-10 rounded-full p-0.5 transition-colors hover:bg-primary-100"
          aria-label={`Quitar filtro ${label}`}
        >
          <X size={12} aria-hidden="true" />
        </span>
      )}

      <input
        ref={inputRef}
        type="date"
        value={value ? value.toISOString().slice(0, 10) : ""}
        onChange={handleInputChange}
        className="absolute inset-0 -z-10 opacity-0"
        tabIndex={-1}
        aria-label={label}
      />
    </button>
  );
}

DateFilterDropdown.displayName = "DateFilterDropdown";
