import { useState } from "react";
import {
  EllipsisVertical,
  FileUser,
  Pencil,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { Button, Popover, PopoverItem, PopoverSeparator } from "@shared/ui";
import type { Exercise } from "../../types";

interface ExerciseActionsMenuProps {
  exercise: Exercise;
  onProfile: (exercise: Exercise) => void;
  onEdit: (exercise: Exercise) => void;
  onSoftDelete: (exercise: Exercise) => void;
  onPhysicalDelete: (exercise: Exercise) => void;
  onRestore: (exercise: Exercise) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExerciseActionsMenu({
  exercise,
  onProfile,
  onEdit,
  onSoftDelete,
  onPhysicalDelete,
  onRestore,
  open: openProp,
  onOpenChange,
}: ExerciseActionsMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };
  const isActive = exercise.isActive;

  const runAndClose = (action: (exercise: Exercise) => void) => () => {
    action(exercise);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      side="bottom"
      align="end"
      trigger={
        <Button
          variant="ghost"
          intent="neutral"
          size="icon"
          aria-label={`Opciones de ${exercise.name}`}
          onClick={() => setOpen(!open)}
        >
          <EllipsisVertical size={16} aria-hidden="true" />
        </Button>
      }
    >
      <PopoverItem
        icon={<FileUser color="#3e4c93" />}
        onClick={runAndClose(onProfile)}
      >
        Ver perfil
      </PopoverItem>
      {isActive ? (
        <>
          <PopoverItem
            icon={<Pencil color="green" />}
            onClick={runAndClose(onEdit)}
          >
            Editar
          </PopoverItem>
          <PopoverSeparator />
          <PopoverItem
            icon={<Trash2 />}
            variant="danger"
            onClick={runAndClose(onSoftDelete)}
          >
            Desactivar
          </PopoverItem>
        </>
      ) : (
        <>
          <PopoverItem icon={<RotateCcw />} onClick={runAndClose(onRestore)}>
            Restaurar
          </PopoverItem>
          <PopoverSeparator />
          <PopoverItem
            icon={<X />}
            variant="danger"
            onClick={runAndClose(onPhysicalDelete)}
          >
            Eliminar definitivamente
          </PopoverItem>
        </>
      )}
    </Popover>
  );
}

ExerciseActionsMenu.displayName = "ExerciseActionsMenu";
