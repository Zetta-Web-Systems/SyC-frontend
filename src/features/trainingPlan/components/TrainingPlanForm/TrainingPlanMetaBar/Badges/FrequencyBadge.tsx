import { useMemo } from "react";
import { Repeat } from "lucide-react";
import { SelectMenu } from "@shared/ui";
import type { SelectMenuOption } from "@shared/ui";
import { cn } from "@shared/lib/cn";

interface FrequencyBadgeProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  className?: string;
}

const OPTIONS = [2, 3, 4, 5, 6, 7] as const;

export function FrequencyBadge({
  value,
  onChange,
  error,
  className,
}: FrequencyBadgeProps) {
  const options = useMemo<SelectMenuOption<number>[]>(
    () =>
      OPTIONS.map((n) => ({
        value: n,
        label: `${n} días/sem`,
        optionLabel: `${n} días por semana`,
      })),
    [],
  );

  return (
    <SelectMenu<number>
      variant="unstyled"
      value={value}
      onChange={onChange}
      options={options}
      error={!!error}
      ariaLabel="Frecuencia semanal"
      panelWidth="170px"
      renderTrigger={(selected) => (
        <>
          <Repeat size={14} className="text-neutral-400" aria-hidden="true" />
          <span className="font-medium text-neutral-500">Frecuencia</span>
          <span className="font-semibold text-neutral-900">
            {selected?.triggerLabel ?? selected?.label ?? "—"}
          </span>
        </>
      )}
      triggerClassName={cn(
        "inline-flex items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 text-sm transition-all",
        "border-neutral-200 hover:border-neutral-300",
        "data-[state=open]:border-primary-500 data-[state=open]:shadow-[0_0_0_3px_rgba(75,93,180,0.10)]",
        "data-[state=closed]:data-[error=true]:border-error",
        className,
      )}
    />
  );
}

FrequencyBadge.displayName = "FrequencyBadge";
