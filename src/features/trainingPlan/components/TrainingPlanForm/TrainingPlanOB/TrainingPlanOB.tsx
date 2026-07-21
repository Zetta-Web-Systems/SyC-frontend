import { TRAINING_PLAN_OB } from "../../../constants";
import { TrainingPlanOBItem } from "./TrainingPlanOBItem";

export function TrainingPlanOB() {
  return (
    <div className="flex flex-col items-stretch gap-2.5 lg:flex-row">
      {TRAINING_PLAN_OB.map((meta) => (
        <TrainingPlanOBItem key={meta.key} meta={meta} />
      ))}
    </div>
  );
}

TrainingPlanOB.displayName = "TrainingPlanOB";
