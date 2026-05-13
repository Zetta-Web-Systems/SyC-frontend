import { ArrowLeft, EllipsisVertical, Pencil } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button, Popover, PopoverItem, PopoverSeparator } from "@shared/ui";
import { useDisclosure } from "@shared/hooks/useDisclosure";
import type { Exercise } from "../../../types";

interface ExerciseProfileActionsMenuProps {
  exercise: Exercise;
  groupId: string;
  onEdit: (exercise: Exercise) => void;
}

export function ExerciseProfileActionsMenu({
  exercise,
  groupId,
  onEdit,
}: ExerciseProfileActionsMenuProps) {
  const { isOpen, close, toggle } = useDisclosure();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: "/exercises/$groupId", params: { groupId } });
    close();
  };

  const handleEdit = () => {
    onEdit(exercise);
    close();
  };

  return (
    <>
      <div className="hidden md:flex shrink-0 gap-2">
        <Link to="/exercises/$groupId" params={{ groupId }}>
          <Button variant="outline" intent="neutral" size="md">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Volver al listado</span>
          </Button>
        </Link>

        {exercise.isActive && (
          <Button
            variant="solid"
            intent="primary"
            size="md"
            onClick={() => onEdit(exercise)}
          >
            <Pencil size={14} aria-hidden="true" />
            <span>Editar ejercicio</span>
          </Button>
        )}
      </div>

      <div className="md:hidden absolute top-4 right-4 sm:top-6 sm:right-6">
        <Popover
          open={isOpen}
          onClose={close}
          side="bottom"
          align="end"
          trigger={
            <Button
              variant="ghost"
              intent="neutral"
              size="icon"
              aria-label="Opciones del ejercicio"
              onClick={toggle}
            >
              <EllipsisVertical size={16} aria-hidden="true" />
            </Button>
          }
        >
          <PopoverItem icon={<ArrowLeft />} onClick={handleBack}>
            Volver al listado
          </PopoverItem>

          {exercise.isActive && (
            <>
              <PopoverSeparator />
              <PopoverItem icon={<Pencil color="green" />} onClick={handleEdit}>
                Editar ejercicio
              </PopoverItem>
            </>
          )}
        </Popover>
      </div>
    </>
  );
}

ExerciseProfileActionsMenu.displayName = "ExerciseProfileActionsMenu";
