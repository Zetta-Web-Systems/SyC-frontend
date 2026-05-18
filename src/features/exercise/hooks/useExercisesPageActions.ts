import { useNavigate } from "@tanstack/react-router";
import type { ExerciseGroup } from "../types";

export function useExercisesPageActions() {
  const navigate = useNavigate();

  function handleSelectGroup(group: ExerciseGroup) {
    navigate({
      to: "/exercises/$groupId",
      params: { groupId: group.id },
    });
  }

  return { handleSelectGroup };
}
