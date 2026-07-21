import { createStore } from "@shared/lib/createStore";
import type { DayName } from "../constants";
import type { RegisterTrainingPlanFormSchema } from "../schemas/registerTrainingPlan.schema";

interface TrainingPlanDraftState {
  draft: RegisterTrainingPlanFormSchema | null;
  selectedMemberId: string | null;
  activeDayName: DayName | null;
  savedAt: number | null;
  stash: (
    draft: RegisterTrainingPlanFormSchema,
    selectedMemberId: string | null,
    activeDayName: DayName | null,
  ) => void;
  save: (
    draft: RegisterTrainingPlanFormSchema,
    selectedMemberId: string | null,
    activeDayName: DayName | null,
  ) => void;
  clear: () => void;
}

export const useTrainingPlanDraft = createStore<TrainingPlanDraftState>(
  "training-plan-draft",
  (set) => ({
    draft: null,
    selectedMemberId: null,
    activeDayName: null,
    savedAt: null,
    stash: (draft, selectedMemberId, activeDayName) =>
      set({ draft, selectedMemberId, activeDayName }),
    save: (draft, selectedMemberId, activeDayName) =>
      set({ draft, selectedMemberId, activeDayName, savedAt: Date.now() }),
    clear: () =>
      set({
        draft: null,
        selectedMemberId: null,
        activeDayName: null,
        savedAt: null,
      }),
  }),
  {
    persist: {
      name: "training-plan-draft",
      partialize: (state) => ({
        draft: state.draft,
        selectedMemberId: state.selectedMemberId,
        activeDayName: state.activeDayName,
        savedAt: state.savedAt,
      }),
    },
  },
);
