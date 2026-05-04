import { cn } from "@shared/lib/cn";
import {
  PAIN_BG_CLASS,
  PAIN_LEVEL_MAX,
  getPainLabel,
  getPainPhase,
  getPainTextClass,
} from "@features/clinicalProfiles";

interface PainLevelBarProps {
  level: number;
  max?: number;
}

export function PainLevelBar({
  level,
  max = PAIN_LEVEL_MAX,
}: PainLevelBarProps) {
  const phase = getPainPhase(level);
  const pct = Math.min((level / max) * 100, 100);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider uppercase">
        <span className="text-neutral-500">Nivel de dolor</span>
        <span className={getPainTextClass(level)}>
          {level}/{max} — {getPainLabel(level)}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-neutral-200"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn("h-full rounded-full", PAIN_BG_CLASS[phase])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

PainLevelBar.displayName = "PainLevelBar";
