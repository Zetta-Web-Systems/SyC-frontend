import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useMemberRegistrationDraft } from "../../../stores/memberRegistrationDraft.store";
import type { RegisterMemberSchema } from "../../../schemas/member.schema";
import { mapClinicalProfileToRiskFlagLikes } from "../../../lib/memberFormTransformers";
import { ClinicalProfileCard } from "./MemberFormFields";

export function ClinicalProfileSlotButton() {
  const { getValues } = useFormContext<RegisterMemberSchema>();
  const navigate = useNavigate();
  const setMemberFields = useMemberRegistrationDraft((s) => s.setMemberFields);
  const clinicalProfile = useMemberRegistrationDraft((s) => s.clinicalProfile);

  const riskFlags = useMemo(
    () => mapClinicalProfileToRiskFlagLikes(clinicalProfile),
    [clinicalProfile],
  );

  function handleOpen() {
    setMemberFields(getValues());
    navigate({ to: "/members/register/clinical-profile" });
  }

  return (
    <ClinicalProfileCard
      mode="create"
      onOpen={handleOpen}
      memberRiskFlags={riskFlags}
    />
  );
}

ClinicalProfileSlotButton.displayName = "ClinicalProfileSlotButton";
