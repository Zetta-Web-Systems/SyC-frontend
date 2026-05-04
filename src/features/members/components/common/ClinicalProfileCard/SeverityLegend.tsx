import type { ExtendedBodyPart } from "@shared/types/bodyHighlighter.types";
import { cn } from "@shared/lib/cn";
import {
  PAIN_BG_CLASS,
  PAIN_PHASES,
  getPainLabel,
  getPainPhase,
  type PainPhase,
} from "@features/clinicalProfiles";

interface SeverityLegendProps {
  bodyParts: ExtendedBodyPart[];
}

const PHASE_ORDER: Record<PainPhase, number> = PAIN_PHASES.reduce(
  (acc, phase, index) => {
    acc[phase] = index;
    return acc;
  },
  {} as Record<PainPhase, number>,
);

const SAMPLE_LEVEL: Record<PainPhase, number> = {
  none: 0,
  veryLow: 1,
  low: 3,
  mid: 5,
  high: 7,
  veryHigh: 9,
};

export function SeverityLegend({ bodyParts }: SeverityLegendProps) {
  const phasesPresent = new Set<PainPhase>();
  for (const part of bodyParts) {
    const phase = getPainPhase(part.intensity ?? 0);
    if (phase !== "none") phasesPresent.add(phase);
  }

  if (phasesPresent.size === 0) return null;

  const phases = [...phasesPresent].sort(
    (a, b) => PHASE_ORDER[a] - PHASE_ORDER[b],
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-neutral-500">
      {phases.map((phase) => (
        <span key={phase} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={cn("size-1.5 rounded-full", PAIN_BG_CLASS[phase])}
          />
          {getPainLabel(SAMPLE_LEVEL[phase])}
        </span>
      ))}
    </div>
  );
}

SeverityLegend.displayName = "SeverityLegend";
