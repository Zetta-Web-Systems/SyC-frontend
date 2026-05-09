import { Body } from "@shared/components/BodyHighlighter";
import type {
  BodySide,
  ExtendedBodyPart,
} from "@shared/types/bodyHighlighter.types";
import {
  GROUP_EXERCISE_THUMBNAIL_DEFAULT_FILL,
  GROUP_EXERCISE_THUMBNAIL_SCALE,
} from "../../../constants";

const ALL_SIDES: readonly BodySide[] = ["front", "back"];

interface GroupExerciseThumbnailProps {
  bodyData: ExtendedBodyPart[];
  sides: BodySide[];
  hasZones: boolean;
}

export function GroupExerciseThumbnail({
  bodyData,
  sides,
  hasZones,
}: GroupExerciseThumbnailProps) {
  const visibleSides: BodySide[] = hasZones ? sides : ["front"];
  const data = hasZones ? bodyData : [];

  return (
    <div
      className="relative flex shrink-0 items-center rounded-l-xl border-r border-neutral-100 bg-neutral-50 px-2 py-3"
      aria-hidden="true"
    >
      <div className="invisible flex gap-0.5" aria-hidden="true">
        {ALL_SIDES.map((side) => (
          <Body
            key={side}
            data={[]}
            side={side}
            scale={GROUP_EXERCISE_THUMBNAIL_SCALE}
            defaultFill={GROUP_EXERCISE_THUMBNAIL_DEFAULT_FILL}
            border="none"
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center gap-0.5">
        {visibleSides.map((side) => (
          <Body
            key={side}
            data={data}
            side={side}
            scale={GROUP_EXERCISE_THUMBNAIL_SCALE}
            defaultFill={GROUP_EXERCISE_THUMBNAIL_DEFAULT_FILL}
            border="none"
          />
        ))}
      </div>
    </div>
  );
}

GroupExerciseThumbnail.displayName = "GroupExerciseThumbnail";
