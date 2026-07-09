import { UserRoundCheck } from "lucide-react";
import { cn } from "@shared/lib/cn";

interface CreatedByBadgeProps {
  value?: string | null;
  className?: string;
}

export function CreatedByBadge({ value, className }: CreatedByBadgeProps) {
  const name = value?.trim();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 shadow-sm",
        className,
      )}
    >
      <UserRoundCheck
        size={14}
        className="text-neutral-400"
        aria-hidden="true"
      />
      <span className="font-medium text-neutral-500">Profesor</span>
      {name ? (
        <span className="font-semibold text-neutral-900">{name}</span>
      ) : (
        <span className="italic text-neutral-400">Sin asignar</span>
      )}
    </span>
  );
}

CreatedByBadge.displayName = "CreatedByBadge";
