import type { ExerciseGroup } from "../../../../types";
import { BasicInfoCard } from "./BasicInfoCard";
import { BodyZonesCard } from "./BodyZonesCard";
import { DetailsCard } from "./DetailsCard";

interface ExerciseFormFieldsProps {
  groups: ExerciseGroup[];
  isLoadingGroups?: boolean;
  onGroupSearch?: (q: string) => void;
  onGroupCreated?: (group: ExerciseGroup) => void;
}

export function ExerciseFormFields({
  groups,
  isLoadingGroups,
  onGroupSearch,
  onGroupCreated,
}: ExerciseFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <BasicInfoCard
        groups={groups}
        isLoadingGroups={isLoadingGroups}
        onGroupSearch={onGroupSearch}
        onGroupCreated={onGroupCreated}
      />
      <BodyZonesCard groups={groups} />
      <DetailsCard />
    </div>
  );
}
