import { Button, Checkbox } from "@shared/ui";

interface ExerciseFormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  createMore?: {
    value: boolean;
    onChange: (value: boolean) => void;
  };
}

export function ExerciseFormActions({
  onCancel,
  isPending,
  submitLabel,
  createMore,
}: ExerciseFormActionsProps) {
  return (
    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {createMore ? (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
          <Checkbox
            checked={createMore.value}
            onChange={(e) => createMore.onChange(e.currentTarget.checked)}
          />
          Crear otro al guardar
        </label>
      ) : (
        <span />
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button intent="neutral" variant="outline" onClick={onCancel}>
          Volver
        </Button>
        <Button type="submit" intent="primary" isLoading={isPending}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

ExerciseFormActions.displayName = "ExerciseFormActions";
