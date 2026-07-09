import { LayoutTemplate, Timer } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Avatar } from "@shared/ui";
import type { Member } from "@features/members";
import type { RegisterTrainingPlanFormSchema } from "../../../schemas/registerTrainingPlan.schema";
import { useTrainingPlanFormErrors } from "../../../hooks/form/useTrainingPlanFormErrors";
import {
  formatMemberMeta,
  memberFullName,
  memberInitials,
} from "../../../lib/memberDisplay";
import { DateBadge } from "./Badges/DateBadge";
import { FrequencyBadge } from "./Badges/FrequencyBadge";
import { CreatedByBadge } from "./Badges/CreatedByBadge";
import { ClinicalProfileButton } from "./ClinicalProfileButton/ClinicalProfileButton";

interface EditTrainingPlanMetaBarProps {
  member: Member | null;
  createdBy?: string | null;
}

export function EditTrainingPlanMetaBar({
  member,
  createdBy,
}: EditTrainingPlanMetaBarProps) {
  const form = useFormContext<RegisterTrainingPlanFormSchema>();
  const { meta } = useTrainingPlanFormErrors();

  const mode = useWatch({ control: form.control, name: "mode" });
  const startDate = useWatch({ control: form.control, name: "startDate" });
  const durationInWeeks = useWatch({
    control: form.control,
    name: "durationInWeeks",
  });
  const daysPerWeek = useWatch({ control: form.control, name: "daysPerWeek" });
  const templateNameRaw = useWatch({
    control: form.control,
    name: "templateName" as never,
  });
  const templateName =
    typeof templateNameRaw === "string" ? templateNameRaw : "";
  const isTemplate = mode === "template";

  function revalidateIfSubmitted() {
    if (form.formState.submitCount > 0) void form.trigger();
  }

  return (
    <div className="flex flex-col items-stretch gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 p-2.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2.5 sm:gap-y-2 sm:p-3">
      <div className="flex min-w-0 items-center gap-3">
        {isTemplate || !member ? (
          <Avatar
            size="md"
            color="primary"
            src={null}
            fallback={<LayoutTemplate size={18} aria-hidden="true" />}
            alt={templateName || "Plantilla"}
          />
        ) : (
          <Avatar
            size="md"
            color="primary"
            src={member.image ?? null}
            fallback={memberInitials(member)}
            alt={memberFullName(member)}
          />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-semibold text-neutral-900">
              {isTemplate || !member
                ? templateName || "Plantilla"
                : memberFullName(member)}
            </span>
            <ClinicalProfileButton
              member={isTemplate ? null : member}
              compact
            />
          </div>
          <div className="truncate text-xs text-neutral-500">
            {isTemplate || !member ? "Plantilla" : formatMemberMeta(member)}
          </div>
        </div>
      </div>

      <span
        className="hidden h-6 w-px bg-neutral-200 sm:block"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 sm:contents">
        <CreatedByBadge value={createdBy} />
        <DateBadge
          value={startDate}
          onChange={(v) => {
            form.setValue("startDate", v, { shouldDirty: true });
            revalidateIfSubmitted();
          }}
          error={meta.startDate}
          className="shadow-sm"
        />

        <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 shadow-sm">
          <Timer size={14} className="text-neutral-400" aria-hidden="true" />
          <span className="font-medium text-neutral-500">Duración</span>
          <span className="font-semibold text-neutral-900">
            {durationInWeeks} {durationInWeeks === 1 ? "semana" : "semanas"}
          </span>
        </span>

        <FrequencyBadge
          value={daysPerWeek}
          onChange={(v) => {
            form.setValue("daysPerWeek", v, { shouldDirty: true });
            revalidateIfSubmitted();
          }}
          error={meta.daysPerWeek}
          className="shadow-sm"
        />
      </div>
    </div>
  );
}

EditTrainingPlanMetaBar.displayName = "EditTrainingPlanMetaBar";
