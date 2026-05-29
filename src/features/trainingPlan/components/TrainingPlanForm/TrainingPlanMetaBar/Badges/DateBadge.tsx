import { Calendar } from "lucide-react";
import { InlineEditField } from "@shared/ui";

interface DateBadgeProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DateBadge({ value, onChange, error }: DateBadgeProps) {
  return (
    <InlineEditField
      type="date"
      value={value}
      onChange={onChange}
      icon={<Calendar size={14} className="text-neutral-400" />}
      label="Inicio"
      error={error}
      ariaLabel="Fecha de inicio del plan"
    />
  );
}

DateBadge.displayName = "DateBadge";
