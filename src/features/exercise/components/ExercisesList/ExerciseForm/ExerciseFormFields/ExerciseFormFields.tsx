import type { Exercise, ExerciseGroup } from "../../../../types";
import { BasicInfoCard } from "./BasicInfoCard";
import { BodyZonesCard } from "./BodyZonesCard";
import { DetailsCard } from "./DetailsCard";

interface ExerciseFormFieldsProps {
  groups: ExerciseGroup[];
  exercise?: Exercise;
  isLoadingGroups?: boolean;
  onGroupSearch?: (q: string) => void;
  onGroupCreated?: (group: ExerciseGroup) => void;
}

export function ExerciseFormFields({
  groups,
  exercise,
  isLoadingGroups,
  onGroupSearch,
  onGroupCreated,
}: ExerciseFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <BasicInfoCard
        groups={groups}
        exercise={exercise}
        isLoadingGroups={isLoadingGroups}
        onGroupSearch={onGroupSearch}
        onGroupCreated={onGroupCreated}
      />
      <BodyZonesCard groups={groups} exercise={exercise} />
      <DetailsCard />
    </div>
  );
}
