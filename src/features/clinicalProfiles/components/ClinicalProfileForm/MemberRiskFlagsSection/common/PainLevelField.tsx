import type { Path } from "react-hook-form";
import { FormField } from "@shared/components/Form";
import { cn } from "@shared/lib/cn";
import { PAIN_LEVEL_MAX, PAIN_TRACK_CLASS } from "../../../../constants";
import { getPainTextClassByPhase } from "../../../../lib/painLevelStyles";
import type { ClinicalProfileFormSchema } from "../../../../schemas/clinicalProfile.schema";
import { getPainLabel, getPainPhase } from "./painLevel";

interface PainLevelFieldProps {
  name: Path<ClinicalProfileFormSchema>;
  label?: string;
}

export function PainLevelField({
  name,
  label = "Nivel de dolor",
}: PainLevelFieldProps) {
  return (
    <FormField<ClinicalProfileFormSchema> name={name} label={label} required>
      {(field) => {
        const numeric = typeof field.value === "number" ? field.value : 0;
        const phase = getPainPhase(numeric);
        const painLabel = getPainLabel(numeric);
        const textClass = getPainTextClassByPhase(phase);
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <input
                ref={field.ref}
                id={field.id}
                name={field.name}
                type="range"
                min={0}
                max={PAIN_LEVEL_MAX}
                step={1}
                value={numeric}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={field.onBlur}
                disabled={field.disabled}
                aria-invalid={field.error || undefined}
                aria-describedby={field["aria-describedby"]}
                className={cn(
                  "h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 disabled:opacity-60",
                  PAIN_TRACK_CLASS[phase],
                )}
              />
              <div className="flex w-16 shrink-0 items-center gap-1">
                <span
                  className={cn("text-sm font-bold tabular-nums", textClass)}
                >
                  {numeric}
                </span>
                <span className="text-xs text-neutral-400">/ 10</span>
              </div>
            </div>
            <span className={cn("text-xs font-medium", textClass)}>
              {painLabel}
            </span>
          </div>
        );
      }}
    </FormField>
  );
}

PainLevelField.displayName = "PainLevelField";
