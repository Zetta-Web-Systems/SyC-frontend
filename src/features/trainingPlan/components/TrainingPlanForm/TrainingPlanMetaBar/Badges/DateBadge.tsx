import { Calendar } from "lucide-react";
import { InlineEditField } from "@shared/ui";

interface DateBadgeProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function DateBadge({
  value,
  onChange,
  error,
  className,
}: DateBadgeProps) {
  return (
    <InlineEditField
      type="date"
      value={value}
      onChange={onChange}
      icon={<Calendar size={14} className="text-neutral-400" />}
      label="Inicio"
      error={error}
      className={className}
      ariaLabel="Fecha de inicio de la planificación"
    />
  );
}

DateBadge.displayName = "DateBadge";
