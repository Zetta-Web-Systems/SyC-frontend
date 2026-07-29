import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";
import { inlineEditShellVariants } from "./InlineEditField.variants";

interface InlineEditCommonProps {
  icon?: ReactNode;
  label?: ReactNode;
  error?: string | boolean;
  shape?: "rounded" | "pill";
  appearance?: "chip" | "seamless";
  className?: string;
  inputClassName?: string;
  ariaLabel?: string;
}

export interface InlineEditTextProps extends InlineEditCommonProps {
  type: "text";
  value: string;
  onChange: (next: string) => void;
  format?: (value: string) => ReactNode;
  placeholder?: string;
  maxLength?: number;
}

export interface InlineEditNumberProps extends InlineEditCommonProps {
  type: "number";
  value: number;
  onChange: (next: number) => void;
  format?: (value: number) => ReactNode;
  min?: number;
  max?: number;
  suffix?: ReactNode;
}

export interface InlineEditDateProps extends InlineEditCommonProps {
  type: "date";
  value: string;
  onChange: (next: string) => void;
  format?: (value: string) => ReactNode;
}

export type InlineEditFieldProps =
  | InlineEditTextProps
  | InlineEditNumberProps
  | InlineEditDateProps;

function clamp(n: number, min: number | undefined, max: number | undefined) {
  let result = n;
  if (typeof min === "number") result = Math.max(min, result);
  if (typeof max === "number") result = Math.min(max, result);
  return result;
}

export function InlineEditField(props: InlineEditFieldProps) {
  const appearance = props.appearance ?? "chip";
  const isSeamless = appearance === "seamless";
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  const errorString =
    typeof props.error === "string" && props.error.length > 0
      ? props.error
      : undefined;
  const hasError = !!props.error;

  useEffect(() => {
    if (!editing) return;
    if (isSeamless) return;
    inputRef.current?.focus();
    if (props.type === "number" || props.type === "text") {
      inputRef.current?.select();
    }
  }, [editing, isSeamless, props.type]);

  function startEdit() {
    if (!editing) setEditing(true);
  }

  function stopEdit() {
    setEditing(false);
  }

  const showAsInput = isSeamless || editing;

  return (
    <span
      className={cn(
        "flex-col",
        isSeamless ? "flex w-full min-w-0" : "inline-flex",
      )}
    >
      <span
        role={!isSeamless && !editing ? "button" : undefined}
        tabIndex={!isSeamless && !editing ? 0 : undefined}
        onClick={isSeamless ? undefined : startEdit}
        onKeyDown={(e) => {
          if (!isSeamless && !editing && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            startEdit();
          }
        }}
        aria-label={!isSeamless ? props.ariaLabel : undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={errorString ? errorId : undefined}
        data-invalid={hasError ? "true" : undefined}
        className={cn(
          inlineEditShellVariants({
            appearance,
            shape: props.shape,
            editing,
            error: hasError,
          }),
          props.className,
        )}
      >
        {props.icon && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {props.icon}
          </span>
        )}
        {props.label && (
          <span className="font-medium text-neutral-500">{props.label}</span>
        )}
        <InlineEditEditor
          {...props}
          editing={showAsInput}
          inputRef={inputRef}
          onStartEdit={startEdit}
          onStopEdit={stopEdit}
          seamless={isSeamless}
        />
      </span>
      {errorString && !editing && (
        <span id={errorId} role="alert" className="mt-1 text-xs text-error">
          {errorString}
        </span>
      )}
    </span>
  );
}

InlineEditField.displayName = "InlineEditField";

interface InlineEditEditorExtra {
  editing: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onStartEdit: () => void;
  onStopEdit: () => void;
  seamless: boolean;
}

function InlineEditEditor(props: InlineEditFieldProps & InlineEditEditorExtra) {
  if (props.type === "date") {
    return <DateEditor {...props} />;
  }
  if (props.type === "number") {
    return <NumberEditor {...props} />;
  }
  return <TextEditor {...props} />;
}

function defaultDateFormat(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${(y ?? "").slice(-2)}`;
}

function DateEditor({
  editing,
  inputRef,
  onStopEdit,
  value,
  onChange,
  format = defaultDateFormat,
  inputClassName,
}: InlineEditDateProps & InlineEditEditorExtra) {
  if (editing) {
    return (
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onStopEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") onStopEdit();
        }}
        className={cn(
          "border-none bg-transparent p-0 text-sm font-semibold text-neutral-900 outline-none",
          inputClassName,
        )}
      />
    );
  }
  return (
    <span className="font-semibold text-neutral-900">{format(value)}</span>
  );
}

function TextEditor({
  editing,
  inputRef,
  onStartEdit,
  onStopEdit,
  seamless,
  value,
  onChange,
  format,
  placeholder,
  maxLength,
  inputClassName,
  ariaLabel,
}: InlineEditTextProps & InlineEditEditorExtra) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function commit() {
    if (draft !== value) onChange(draft);
    onStopEdit();
  }

  function cancel() {
    setDraft(value);
    onStopEdit();
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-label={seamless ? ariaLabel : undefined}
        onFocus={seamless ? onStartEdit : undefined}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          } else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
        }}
        className={cn(
          "border-none bg-transparent p-0 outline-none placeholder:text-neutral-400",
          seamless
            ? "w-full text-inherit"
            : "text-sm font-semibold text-neutral-900",
          inputClassName,
        )}
      />
    );
  }
  return (
    <span className="font-semibold text-neutral-900">
      {format ? format(value) : value || placeholder || "—"}
    </span>
  );
}

function NumberEditor({
  editing,
  inputRef,
  onStopEdit,
  value,
  onChange,
  format,
  min,
  max,
  suffix,
  inputClassName,
}: InlineEditNumberProps & InlineEditEditorExtra) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  function commit() {
    const parsed = parseInt(draft, 10);
    const next = clamp(Number.isFinite(parsed) ? parsed : (min ?? 0), min, max);
    onChange(next);
    setDraft(String(next));
    onStopEdit();
  }

  function cancel() {
    setDraft(String(value));
    onStopEdit();
  }

  if (editing) {
    return (
      <>
        <input
          ref={inputRef}
          type="number"
          min={min}
          max={max}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            }
          }}
          className={cn(
            "w-10 border-none bg-transparent p-0 text-sm font-semibold text-neutral-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            inputClassName,
          )}
        />
        {suffix && (
          <span className="font-medium text-neutral-500">{suffix}</span>
        )}
      </>
    );
  }
  return (
    <span className="font-semibold text-neutral-900">
      {format ? format(value) : value}
    </span>
  );
}
