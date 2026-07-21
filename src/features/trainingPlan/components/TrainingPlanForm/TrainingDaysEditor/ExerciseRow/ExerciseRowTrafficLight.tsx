import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Spinner } from "@shared/ui";
import type { CurrentStatus } from "@features/clinicalProfiles";
import { TrainingPlanRiskIndicator } from "../../../TrainingPlanRiskIndicator/TrainingPlanRiskIndicator";

const CHECK_VISIBLE_MS = 2500;

interface ExerciseRowTrafficLightProps {
  isLoading: boolean;
  isYellow: boolean;
  affected: CurrentStatus[];
}

export function ExerciseRowTrafficLight({
  isLoading,
  isYellow,
  affected,
}: ExerciseRowTrafficLightProps) {
  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (isYellow) {
    return <TrainingPlanRiskIndicator affected={affected} />;
  }

  return <SuccessCheck />;
}

ExerciseRowTrafficLight.displayName = "ExerciseRowTrafficLight";

function SuccessCheck() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), CHECK_VISIBLE_MS);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <span
      title="Sin precauciones"
      aria-label="Sin precauciones"
      className="inline-flex shrink-0 animate-[attendance-icon-bounce_500ms_ease-out_both] items-center justify-center rounded-full bg-success/10 p-0.5 text-success"
    >
      <Check size={14} aria-hidden="true" />
    </span>
  );
}
