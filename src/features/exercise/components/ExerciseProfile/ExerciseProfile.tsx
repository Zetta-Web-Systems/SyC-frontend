import type { DisclosureState } from "@shared/hooks/useDisclosure";
import type { ActiveVideoState } from "../../hooks/useActiveVideo";
import type { Exercise } from "../../types";
import { ExerciseProfileHeader } from "./ExerciseProfileSections/ExerciseProfileHeader";
import { ExerciseProfileNotes } from "./ExerciseProfileSections/ExerciseProfileNotes";
import { ExerciseProfileOtherLinks } from "./ExerciseProfileSections/ExerciseProfileOtherLinks";
import { ExerciseProfileBodyCard } from "./ExerciseProfileSections/ExerciseProfileBodyCard";
import { ExerciseHeroCard } from "./ExerciseHeroCard/ExerciseHeroCard";

interface ExerciseProfileProps {
  exercise: Exercise;
  groupId: string;
  onEdit: (exercise: Exercise) => void;
  bodyDetailModal: DisclosureState;
  videoSelection: ActiveVideoState;
}

export function ExerciseProfile({
  exercise,
  groupId,
  onEdit,
  bodyDetailModal,
  videoSelection,
}: ExerciseProfileProps) {
  return (
    <div className="flex flex-col gap-6">
      <ExerciseProfileHeader
        exercise={exercise}
        groupId={groupId}
        onEdit={onEdit}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <ExerciseHeroCard
            exercise={exercise}
            videoSelection={videoSelection}
          />
          <ExerciseProfileOtherLinks exercise={exercise} />
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-4 lg:sticky lg:top-4">
          <ExerciseProfileBodyCard
            exercise={exercise}
            bodyDetailModal={bodyDetailModal}
          />
          <ExerciseProfileNotes exercise={exercise} />
        </aside>
      </div>
    </div>
  );
}

ExerciseProfile.displayName = "ExerciseProfile";
