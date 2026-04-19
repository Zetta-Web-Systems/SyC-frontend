import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMemberRegistrationDraft } from "@features/members/stores/memberRegistrationDraft.store";

export function useClinicalProfileDraftGuard() {
  const navigate = useNavigate();
  const memberFields = useMemberRegistrationDraft((s) => s.memberFields);
  const clinicalProfile = useMemberRegistrationDraft((s) => s.clinicalProfile);
  const setClinicalProfile = useMemberRegistrationDraft(
    (s) => s.setClinicalProfile,
  );

  useEffect(() => {
    if (!memberFields) {
      navigate({ to: "/members/register" });
    }
  }, [memberFields, navigate]);

  return {
    memberFields,
    clinicalProfile,
    setClinicalProfile,
    ready: !!memberFields,
  };
}
