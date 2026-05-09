import { useState } from "react";
import { Dumbbell, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { Button, Popover, PopoverItem, PopoverSeparator } from "@shared/ui";
import { AffectedZonesBadges } from "@shared/components/AffectedZonesBadges";
import type { ExerciseGroup } from "../../types";

interface GroupExerciseCardProps {
  group: ExerciseGroup;
  onEdit: (group: ExerciseGroup) => void;
  onDelete: (group: ExerciseGroup) => void;
}

export function GroupExerciseCard({
  group,
  onEdit,
  onDelete,
}: GroupExerciseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const exercisesCount = group.exercises?.length ?? 0;
  const exercisesSubtitle =
    exercisesCount === 0
      ? "Sin ejercicios"
      : `${exercisesCount} ${exercisesCount === 1 ? "ejercicio" : "ejercicios"}`;

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {group.name}
          </p>
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <Dumbbell
              size={12}
              className="text-primary-500"
              aria-hidden="true"
            />
            {exercisesSubtitle}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
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
                aria-label={`Opciones de ${group.name}`}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <EllipsisVertical size={16} aria-hidden="true" />
              </Button>
            }
          >
            <PopoverItem
              icon={<Pencil color="green" />}
              onClick={() => {
                onEdit(group);
                setMenuOpen(false);
              }}
            >
              Editar
            </PopoverItem>
            <PopoverSeparator />
            <PopoverItem
              icon={<Trash2 />}
              variant="danger"
              onClick={() => {
                onDelete(group);
                setMenuOpen(false);
              }}
            >
              Eliminar
            </PopoverItem>
          </Popover>
        </div>
      </div>

      <hr className="border-neutral-200 my-3" />

      <div className="flex flex-col gap-1 text-xs text-neutral-500">
        <span className="text-center text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Zonas afectadas
        </span>
        <AffectedZonesBadges zones={group.affectedZones} max={3} />
      </div>
    </div>
  );
}

GroupExerciseCard.displayName = "GroupExerciseCard";
