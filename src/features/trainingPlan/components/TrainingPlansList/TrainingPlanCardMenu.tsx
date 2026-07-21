import { useState } from "react";
import {
  Ban,
  CalendarPlus,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button, Popover, PopoverItem, PopoverSeparator } from "@shared/ui";
import type { TrainingPlanSimple } from "../../types";
import { PlanState } from "../../constants";
import {
  getTrainingPlanDescription,
  getTrainingPlanKind,
  TRAINING_PLAN_KIND,
} from "../../lib/trainingPlanKind";

interface TrainingPlanCardMenuProps {
  trainingPlan: TrainingPlanSimple;
  onEdit: (trainingPlan: TrainingPlanSimple) => void;
  onDelete: (trainingPlan: TrainingPlanSimple) => void;
  onExtend: (trainingPlan: TrainingPlanSimple) => void;
}

export function TrainingPlanCardMenu({
  trainingPlan,
  onEdit,
  onDelete,
  onExtend,
}: TrainingPlanCardMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const kind = getTrainingPlanKind(trainingPlan);
  const description = getTrainingPlanDescription(trainingPlan);
  const isCancelled = trainingPlan.state === PlanState.CANCELLED;
  const isCompleted = trainingPlan.state === PlanState.COMPLETED;
  const canExtend = kind === TRAINING_PLAN_KIND.REGULAR && !isCancelled;

  function runAction(action: () => void) {
    action();
    setMenuOpen(false);
  }

  return (
    <Popover
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      side="bottom"
      align="end"
      trigger={
        <Button
          variant="ghost"
          intent="neutral"
          size="icon"
          aria-label={`Opciones de ${description}`}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <EllipsisVertical size={16} aria-hidden="true" />
        </Button>
      }
    >
      {canExtend && (
        <PopoverItem
          icon={<CalendarPlus color="#4ea49c" />}
          onClick={() => runAction(() => onExtend(trainingPlan))}
        >
          Extender
        </PopoverItem>
      )}
      {!isCompleted && (
        <PopoverItem
          icon={<Pencil color="green" />}
          onClick={() => runAction(() => onEdit(trainingPlan))}
        >
          Editar
        </PopoverItem>
      )}
      <PopoverSeparator />
      <PopoverItem
        icon={isCancelled ? <Trash2 /> : <Ban />}
        variant="danger"
        onClick={() => runAction(() => onDelete(trainingPlan))}
      >
        {isCancelled ? "Eliminar" : "Cancelar"}
      </PopoverItem>
    </Popover>
  );
}

TrainingPlanCardMenu.displayName = "TrainingPlanCardMenu";
