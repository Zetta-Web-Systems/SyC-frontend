import { useRef, useState } from "react";
import { Dumbbell } from "lucide-react";
import { Badge } from "@shared/ui";
import type { Exercise } from "../../types";
import {
  EXERCISE_LEVEL_INTENT,
  EXERCISE_LEVEL_LABELS,
  EXERCISE_LEVEL_TEXT_COLOR_CLASS,
  YOUTUBE_FAVICON_URL,
} from "../../constants";
import { hasYouTubeLink } from "../../utils/linkPreview.utils";
import { ExerciseActionsMenu } from "./ExerciseActionsMenu";

interface ExerciseCardProps {
  exercise: Exercise;
  onProfile: (exercise: Exercise) => void;
  onEdit: (exercise: Exercise) => void;
  onSoftDelete: (exercise: Exercise) => void;
  onPhysicalDelete: (exercise: Exercise) => void;
  onRestore: (exercise: Exercise) => void;
}

export function ExerciseCard({
  exercise,
  onProfile,
  onEdit,
  onSoftDelete,
  onPhysicalDelete,
  onRestore,
}: ExerciseCardProps) {
  const isActive = exercise.isActive;
  const hasYoutubeVideo = hasYouTubeLink(exercise.links);
  const levelIntent = EXERCISE_LEVEL_INTENT[exercise.exerciseLevel];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWasOpenRef = useRef(false);

  const handleOpenProfile = () => onProfile(exercise);

  const handleCardClick = () => {
    if (menuWasOpenRef.current) {
      menuWasOpenRef.current = false;
      return;
    }
    handleOpenProfile();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseDown={() => {
        menuWasOpenRef.current = menuOpen;
      }}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenProfile();
        }
      }}
      aria-label={`Ver perfil de ejercicio ${exercise.name}`}
      className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <div className="relative size-18 shrink-0">
        <div className="size-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/60">
          {exercise.image ? (
            <img
              src={exercise.image}
              alt={exercise.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              <Dumbbell size={32} aria-hidden="true" />
            </div>
          )}
          {!isActive && (
            <Badge
              intent="error"
              size="sm"
              className="absolute top-1.5 left-1.5 shadow-sm"
            >
              INACTIVO
            </Badge>
          )}
        </div>
        {hasYoutubeVideo && (
          <img
            src={YOUTUBE_FAVICON_URL}
            alt="Tiene video de YouTube"
            title="Tiene video de YouTube"
            className="pointer-events-none absolute -top-1.5 -left-1.5 z-10 size-5 -rotate-12 drop-shadow-sm"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <span className="line-clamp-2 text-base leading-tight font-semibold text-neutral-900">
          {exercise.name}
        </span>
        <Badge
          variant="dot"
          intent={levelIntent}
          size="md"
          className="text-neutral-800"
        >
          Nivel{" "}
          <span className={EXERCISE_LEVEL_TEXT_COLOR_CLASS[levelIntent]}>
            {EXERCISE_LEVEL_LABELS[exercise.exerciseLevel]}
          </span>
        </Badge>
      </div>

      <div
        className="shrink-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <ExerciseActionsMenu
          exercise={exercise}
          onProfile={onProfile}
          onEdit={onEdit}
          onSoftDelete={onSoftDelete}
          onPhysicalDelete={onPhysicalDelete}
          onRestore={onRestore}
          open={menuOpen}
          onOpenChange={setMenuOpen}
        />
      </div>
    </div>
  );
}

ExerciseCard.displayName = "ExerciseCard";
