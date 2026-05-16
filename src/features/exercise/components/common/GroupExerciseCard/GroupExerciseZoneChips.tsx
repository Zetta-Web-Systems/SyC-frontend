import { cn } from "@shared/lib/cn";
import { BODY_ZONE_INTENT_CLASSES } from "../../../constants";
import { getIntentForBlock } from "../../../utils/groupExerciseCard.utils";

interface GroupExerciseZoneChipsProps {
  blocks: string[];
}

export function GroupExerciseZoneChips({
  blocks,
}: GroupExerciseZoneChipsProps) {
  if (blocks.length === 0) {
    return <span className="text-xs italic text-neutral-400">Sin zonas</span>;
  }

  return (
    <>
      {blocks.map((label) => {
        const intent = getIntentForBlock(label);
        const { chip, dot } = BODY_ZONE_INTENT_CLASSES[intent];
        return (
          <span
            key={label}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
              chip,
            )}
          >
            <span
              className={cn("h-1.5 w-1.5 rounded-full", dot)}
              aria-hidden="true"
            />
            {label}
          </span>
        );
      })}
    </>
  );
}

GroupExerciseZoneChips.displayName = "GroupExerciseZoneChips";
