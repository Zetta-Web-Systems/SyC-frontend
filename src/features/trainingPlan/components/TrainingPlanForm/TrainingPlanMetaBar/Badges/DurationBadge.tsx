import { InlineEditField } from "@shared/ui";

interface DurationBadgeProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  error?: string;
}

export function DurationBadge({
  value,
  onChange,
  min = 1,
  max = 52,
  error,
}: DurationBadgeProps) {
  return (
    <InlineEditField
      type="number"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      label="Duración"
      suffix="semanas"
      format={(n) => `${n} ${n === 1 ? "semana" : "semanas"}`}
      error={error}
      ariaLabel="Duración en semanas"
    />
  );
}

DurationBadge.displayName = "DurationBadge";
