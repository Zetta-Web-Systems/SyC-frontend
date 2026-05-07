import { Button } from "@shared/ui";

interface ClinicalProfileFormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

export function ClinicalProfileFormActions({
  onCancel,
  isPending,
  submitLabel,
}: ClinicalProfileFormActionsProps) {
  return (
    <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button intent="neutral" variant="outline" onClick={onCancel}>
        Volver
      </Button>
      <Button type="submit" intent="primary" isLoading={isPending}>
        {submitLabel}
      </Button>
    </div>
  );
}

ClinicalProfileFormActions.displayName = "ClinicalProfileFormActions";
