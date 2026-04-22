import { useFormContext } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { Stethoscope } from "lucide-react";
import { Badge, Button } from "@shared/ui";
import { useMemberRegistrationDraft } from "../../../stores/memberRegistrationDraft.store";
import type { RegisterMemberSchema } from "../../../schemas/member.schema";

export function ClinicalProfileSlotButton() {
  const { getValues } = useFormContext<RegisterMemberSchema>();
  const navigate = useNavigate();
  const setMemberFields = useMemberRegistrationDraft((s) => s.setMemberFields);
  const clinicalProfile = useMemberRegistrationDraft((s) => s.clinicalProfile);

  const riskFlagCount = clinicalProfile?.memberRiskFlags.length ?? 0;

  function handleClick() {
    setMemberFields(getValues());
    navigate({ to: "/members/register/clinical-profile" });
  }

  return (
    <div className="flex items-center gap-3">
      <Button intent="neutral" variant="outline" onClick={handleClick}>
        <Stethoscope size={16} aria-hidden="true" />
        Perfil clínico
      </Button>
      {riskFlagCount > 0 && (
        <Badge variant="solid">
          {riskFlagCount} {riskFlagCount === 1 ? "flag" : "flags"}
        </Badge>
      )}
    </div>
  );
}
