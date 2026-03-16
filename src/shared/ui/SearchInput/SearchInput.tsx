import type { Ref } from "react";
import type { ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@shared/ui";
import { useDebounce } from "@shared/hooks/useDebounce";

export interface SearchInputProps {
  id?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
  clearLabel?: string;
  delay?: number;
  onSearch: (value: string) => void;
}

export function SearchInput({
  id,
  className,
  ref,
  placeholder = "Buscar...",
  disabled,
  clearLabel = "Limpiar búsqueda",
  delay = 300,
  onSearch,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, delay);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleClear() {
    setValue("");
  }

  const clearButton = value ? (
    <button
      type="button"
      aria-label={clearLabel}
      onClick={handleClear}
      className="flex items-center text-neutral-400 transition-colors hover:text-neutral-600"
    >
      <X size={14} aria-hidden="true" />
    </button>
  ) : undefined;

  return (
    <Input
      ref={ref}
      id={id}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      leftElement={<Search size={16} aria-hidden="true" />}
      rightElement={clearButton}
    />
  );
}

SearchInput.displayName = "SearchInput";
