import { useFormContext, useWatch } from "react-hook-form";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import type { ClinicalProfileFormSchema } from "../../../../schemas/clinicalProfile.schema";

interface NotesPreviewProps {
  index: number;
}

export function NotesPreview({ index }: NotesPreviewProps) {
  const { control } = useFormContext<ClinicalProfileFormSchema>();
  const notes = useWatch({
    control,
    name: memberRiskFlagPaths.notes(index),
  }) as string | undefined;

  if (!notes) return null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
        Notas clínicas
      </span>
      <p className="text-xs leading-relaxed text-neutral-500 line-clamp-2">
        {notes}
      </p>
    </div>
  );
}

NotesPreview.displayName = "NotesPreview";
