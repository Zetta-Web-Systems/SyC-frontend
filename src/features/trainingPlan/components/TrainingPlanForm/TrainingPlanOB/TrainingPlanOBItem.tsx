import { Controller, useFormContext } from "react-hook-form";
import { IconBox, Textarea } from "@shared/ui";
import type { TrainingPlanOBEntry } from "../../../constants";
import type { RegisterTrainingPlanFormSchema } from "../../../schemas/registerTrainingPlan.schema";
import { useTrainingPlanFormErrors } from "../../../hooks/form/useTrainingPlanFormErrors";

interface TrainingPlanOBItemProps {
  meta: TrainingPlanOBEntry;
}

export function TrainingPlanOBItem({ meta }: TrainingPlanOBItemProps) {
  const form = useFormContext<RegisterTrainingPlanFormSchema>();
  const { meta: metaErrors } = useTrainingPlanFormErrors();
  const errorMessage = metaErrors[meta.key];

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="flex items-center gap-2.5 border-b border-neutral-200 px-3 py-2.5">
        <IconBox size="sm" shape="md" tone="subtle" intent={meta.tone}>
          <span className="block h-2 w-2 rounded-full bg-current" />
        </IconBox>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-neutral-900">{meta.label}</div>
          <div className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            {meta.badge}
          </div>
        </div>
      </div>

      <div className="flex-1 p-3">
        <Controller
          control={form.control}
          name={meta.key}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder={meta.placeholder}
              className="min-h-22 text-sm"
              error={!!errorMessage}
              errorMessage={errorMessage}
              onChange={(e) => {
                field.onChange(e);
                if (form.formState.submitCount > 0) {
                  void form.trigger();
                }
              }}
            />
          )}
        />
      </div>
    </div>
  );
}

TrainingPlanOBItem.displayName = "TrainingPlanOBItem";
