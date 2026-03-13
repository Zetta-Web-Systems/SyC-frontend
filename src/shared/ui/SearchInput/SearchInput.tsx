import type { Ref } from "react";
import type { ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@shared/hooks/useDebounce";
import { Input } from "@shared/ui/Input/Input";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 256 256"
    aria-hidden="true"
  >
    <path d="M229.66,218.34l-50.07-50.07a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
  </svg>
);

const ClearIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="currentColor"
    viewBox="0 0 256 256"
    aria-hidden="true"
  >
    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
  </svg>
);

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
      <ClearIcon />
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
      leftElement={<SearchIcon />}
      rightElement={clearButton}
    />
  );
}

SearchInput.displayName = "SearchInput";
