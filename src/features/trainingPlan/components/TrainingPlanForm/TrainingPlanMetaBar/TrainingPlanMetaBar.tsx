import { useFormContext, useWatch } from "react-hook-form";
import type { Member } from "@features/members";
import type { RegisterTrainingPlanFormSchema } from "../../../schemas/registerTrainingPlan.schema";
import { useTrainingPlanModeSwitch } from "../../../hooks/form/useTrainingPlanModeSwitch";
import { useTrainingPlanFormErrors } from "../../../hooks/form/useTrainingPlanFormErrors";
import { DateBadge } from "./Badges/DateBadge";
import { DurationBadge } from "./Badges/DurationBadge";
import { FrequencyBadge } from "./Badges/FrequencyBadge";
import { MemberSelectorPill } from "./MemberSelector/MemberSelectorPill";
import { ClinicalProfileButton } from "./ClinicalProfileButton/ClinicalProfileButton";

interface TrainingPlanMetaBarProps {
  selectedMember: Member | null;
  onSelectMember: (member: Member) => void;
}

export function TrainingPlanMetaBar({
  selectedMember,
  onSelectMember,
}: TrainingPlanMetaBarProps) {
  const form = useFormContext<RegisterTrainingPlanFormSchema>();
  const { setMode } = useTrainingPlanModeSwitch();
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

  function revalidateIfSubmitted() {
    if (form.formState.submitCount > 0) {
      void form.trigger();
    }
  }

  function handleToggleTemplate() {
    setMode(mode === "template" ? "plan" : "template");
    revalidateIfSubmitted();
  }

  function handleTemplateNameChange(value: string) {
    form.setValue("templateName" as never, value as never, {
      shouldDirty: true,
    });
    revalidateIfSubmitted();
  }

  function handleSelectMember(member: Member) {
    if (mode === "template") setMode("plan");
    form.setValue("memberId" as never, member.id as never, {
      shouldDirty: true,
    });
    revalidateIfSubmitted();
    onSelectMember(member);
  }

  return (
    <div className="flex flex-col items-stretch gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 p-2.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2.5 sm:gap-y-2 sm:p-3">
      <MemberSelectorPill
        selectedMember={mode === "template" ? null : selectedMember}
        isTemplate={mode === "template"}
        templateName={templateName}
        memberError={meta.memberId}
        templateNameError={meta.templateName}
        onSelectMember={handleSelectMember}
        onToggleTemplate={handleToggleTemplate}
        onTemplateNameChange={handleTemplateNameChange}
      />

      <span
        className="hidden h-6 w-px bg-neutral-200 sm:block"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 sm:contents">
        <DateBadge
          value={startDate}
          onChange={(v) => {
            form.setValue("startDate", v, { shouldDirty: true });
            revalidateIfSubmitted();
          }}
          error={meta.startDate}
        />
        <DurationBadge
          value={durationInWeeks}
          onChange={(v) => {
            form.setValue("durationInWeeks", v, { shouldDirty: true });
            revalidateIfSubmitted();
          }}
          error={meta.durationInWeeks}
        />
        <FrequencyBadge
          value={daysPerWeek}
          onChange={(v) => {
            form.setValue("daysPerWeek", v, { shouldDirty: true });
            revalidateIfSubmitted();
          }}
          error={meta.daysPerWeek}
        />
      </div>

      <span className="hidden sm:block sm:flex-1" />

      <ClinicalProfileButton
        member={mode === "template" ? null : selectedMember}
      />
    </div>
  );
}

TrainingPlanMetaBar.displayName = "TrainingPlanMetaBar";
