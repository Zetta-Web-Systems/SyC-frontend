import { createStore } from "@shared/lib/createStore";
import type { ClinicalProfileFormSchema } from "@features/clinicalProfiles";
import type { RegisterMemberSchema } from "../schemas/member.schema";

interface MemberRegistrationDraftState {
  memberFields: RegisterMemberSchema | null;
  clinicalProfile: ClinicalProfileFormSchema | null;
  setMemberFields: (fields: RegisterMemberSchema) => void;
  setClinicalProfile: (profile: ClinicalProfileFormSchema) => void;
  reset: () => void;
}

export const useMemberRegistrationDraft =
  createStore<MemberRegistrationDraftState>(
    "member-registration-draft",
    (set) => ({
      memberFields: null,
      clinicalProfile: null,
      setMemberFields: (memberFields) => set({ memberFields }),
      setClinicalProfile: (clinicalProfile) => set({ clinicalProfile }),
      reset: () => set({ memberFields: null, clinicalProfile: null }),
    }),
  );
