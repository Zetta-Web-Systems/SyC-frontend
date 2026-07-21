import { Dumbbell } from "lucide-react";
import { Badge } from "@shared/ui";
import {
  EXERCISE_LEVEL_INTENT,
  EXERCISE_LEVEL_LABELS,
  EXERCISE_LEVEL_TEXT_COLOR_CLASS,
  YOUTUBE_FAVICON_URL,
  hasYouTubeLink,
} from "@features/exercise";
import type { Exercise } from "@features/exercise";

interface ExerciseLibraryCardOverlayProps {
  exercise: Exercise;
}

export function ExerciseLibraryCardOverlay({
  exercise,
}: ExerciseLibraryCardOverlayProps) {
  const hasYoutubeVideo = hasYouTubeLink(exercise.links);
  const levelIntent = EXERCISE_LEVEL_INTENT[exercise.exerciseLevel];

  return (
    <div className="flex w-100 max-w-[90vw] cursor-grabbing items-center gap-3 rounded-2xl border border-primary-300 bg-white p-2.5 shadow-2xl ring-4 ring-primary-200/40">
      <div className="relative size-14 shrink-0">
        <div className="size-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/60">
          {exercise.image ? (
            <img
              src={exercise.image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              <Dumbbell size={24} aria-hidden="true" />
            </div>
          )}
        </div>
        {hasYoutubeVideo && (
          <img
            src={YOUTUBE_FAVICON_URL}
            alt=""
            className="pointer-events-none absolute -top-1.5 -left-1.5 z-10 size-4 -rotate-12 drop-shadow-sm"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="line-clamp-2 text-sm leading-tight font-semibold text-neutral-900">
          {exercise.name}
        </span>
        <Badge
          variant="dot"
          intent={levelIntent}
          size="sm"
          className="self-start text-neutral-800"
        >
          Nivel{" "}
          <span className={EXERCISE_LEVEL_TEXT_COLOR_CLASS[levelIntent]}>
            {EXERCISE_LEVEL_LABELS[exercise.exerciseLevel]}
          </span>
        </Badge>
      </div>
    </div>
  );
}

ExerciseLibraryCardOverlay.displayName = "ExerciseLibraryCardOverlay";
