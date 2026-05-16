import { useState } from "react";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { Button, Popover, PopoverItem, PopoverSeparator } from "@shared/ui";

interface GroupExerciseActionsMenuProps {
  groupName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function GroupExerciseActionsMenu({
  groupName,
  onEdit,
  onDelete,
}: GroupExerciseActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    onEdit?.();
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete?.();
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
          aria-label={`Opciones de ${groupName}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <EllipsisVertical size={16} aria-hidden="true" />
        </Button>
      }
    >
      {onEdit && (
        <PopoverItem icon={<Pencil color="green" />} onClick={handleEdit}>
          Editar
        </PopoverItem>
      )}
      {onEdit && onDelete && <PopoverSeparator />}
      {onDelete && (
        <PopoverItem icon={<Trash2 />} variant="danger" onClick={handleDelete}>
          Eliminar
        </PopoverItem>
      )}
    </Popover>
  );
}

GroupExerciseActionsMenu.displayName = "GroupExerciseActionsMenu";
