import { Pencil, UserCheck, UserX } from "lucide-react";
import { Badge, Button } from "@shared/ui";
import type { Instructor } from "../../types";

interface InstructorCardProps {
  instructor: Instructor;
  onEdit: (instructor: Instructor) => void;
  onDelete: (instructor: Instructor) => void;
  onRestore: (instructor: Instructor) => void;
}

export function InstructorCard({
  instructor,
  onEdit,
  onDelete,
  onRestore,
}: InstructorCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {instructor.name} {instructor.lastname}
            </p>
            <Badge
              intent={instructor.isActive ? "success" : "neutral"}
              size="sm"
            >
              {instructor.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="mt-1 truncate text-sm text-neutral-500">
            {instructor.email}
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">
            DNI: {instructor.dni}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {instructor.isActive ? (
            <>
              <Button
                variant="ghost"
                intent="secondary"
                size="icon"
                aria-label={`Editar profesor ${instructor.name} ${instructor.lastname}`}
                onClick={() => onEdit(instructor)}
              >
                <Pencil size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                intent="danger"
                size="icon"
                aria-label={`Eliminar profesor ${instructor.name} ${instructor.lastname}`}
                onClick={() => onDelete(instructor)}
              >
                <UserX size={16} aria-hidden="true" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              intent="secondary"
              size="icon"
              aria-label={`Restaurar profesor ${instructor.name} ${instructor.lastname}`}
              onClick={() => onRestore(instructor)}
            >
              <UserCheck size={16} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

InstructorCard.displayName = "InstructorCard";
