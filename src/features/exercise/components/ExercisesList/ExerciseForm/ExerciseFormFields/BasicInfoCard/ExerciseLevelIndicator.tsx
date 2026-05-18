import { cn } from "@shared/lib/cn";
import type { ExerciseLevel } from "../../../../../constants";

const LEVEL_COLORS = ["bg-success", "bg-warning", "bg-error"] as const;

interface ExerciseLevelIndicatorProps {
  level: ExerciseLevel | undefined;
}

export function ExerciseLevelIndicator({ level }: ExerciseLevelIndicatorProps) {
  const levelNumber = level ? Number(level) : 0;

  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cn(
            "h-2.5 w-2.5 rounded-full transition-colors",
            n <= levelNumber ? LEVEL_COLORS[n - 1] : "bg-neutral-200",
          )}
        />
      ))}
    </div>
  );
}
