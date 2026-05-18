import { cn } from "@shared/lib/cn";
import { useGroupExerciseCardZones } from "../../hooks/useGroupExerciseCardZones";
import type { ExerciseGroup } from "../../types";
import { GroupExerciseActionsMenu } from "./GroupExerciseCard/GroupExerciseActionsMenu";
import { GroupExerciseHeader } from "./GroupExerciseCard/GroupExerciseHeader";
import { GroupExerciseThumbnail } from "./GroupExerciseCard/GroupExerciseThumbnail";
import { GroupExerciseZoneChips } from "./GroupExerciseCard/GroupExerciseZoneChips";

interface GroupExerciseCardProps {
  group: ExerciseGroup;
  onEdit?: (group: ExerciseGroup) => void;
  onDelete?: (group: ExerciseGroup) => void;
  onSelect?: (group: ExerciseGroup) => void;
}

export function GroupExerciseCard({
  group,
  onEdit,
  onDelete,
  onSelect,
}: GroupExerciseCardProps) {
  const hasZones = (group.affectedZones?.length ?? 0) > 0;
  const { blocks, sides, bodyData } = useGroupExerciseCardZones(
    group.affectedZones,
  );

  const isSelectable = !!onSelect;
  const showActions = !!onEdit || !!onDelete;

  const content = (
    <>
      <GroupExerciseThumbnail
        bodyData={bodyData}
        sides={sides}
        hasZones={hasZones}
      />

      <div className="flex flex-1 flex-col gap-2 p-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <GroupExerciseHeader name={group.name} />
          {showActions && (
            <GroupExerciseActionsMenu
              groupName={group.name}
              onEdit={onEdit ? () => onEdit(group) : undefined}
              onDelete={onDelete ? () => onDelete(group) : undefined}
            />
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          <GroupExerciseZoneChips blocks={blocks} />
        </div>
      </div>
    </>
  );

  if (isSelectable) {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(group)}
        className={cn(
          "flex w-full cursor-pointer rounded-xl border border-neutral-200 bg-white text-left shadow-sm transition-shadow",
          "hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex w-full rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {content}
    </div>
  );
}

GroupExerciseCard.displayName = "GroupExerciseCard";
