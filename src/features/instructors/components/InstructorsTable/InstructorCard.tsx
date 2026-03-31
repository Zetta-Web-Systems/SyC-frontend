import { useState } from "react";
import {
  CalendarDays,
  EllipsisVertical,
  Pencil,
  UserCheck,
  UserX,
} from "lucide-react";
// import { useNavigate } from "@tanstack/react-router";
import {
  Avatar,
  Badge,
  Button,
  Popover,
  PopoverItem,
  PopoverSeparator,
} from "@shared/ui";
import { formatDateTime } from "@shared/utils/date.utils";
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
  const [menuOpen, setMenuOpen] = useState(false);
  // const navigate = useNavigate();

  const initials = (
    instructor.name.charAt(0) + instructor.lastname.charAt(0)
  ).toUpperCase();

  const fullName = `${instructor.name} ${instructor.lastname}`;

  return (
    <div className="border-b border-neutral-200 pb-3">
      <div className="flex items-start gap-3">
        <Avatar size="md" color="primary" fallback={initials} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {fullName}
            </p>
            <Badge
              intent={instructor.isActive ? "success" : "error"}
              size="sm"
              className="mt-0.5"
            >
              {instructor.isActive ? "ACTIVO" : "INACTIVO"}
            </Badge>
          </div>

          <p className="mt-0.5 truncate text-xs text-neutral-500">
            {instructor.email}
          </p>

          <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
            <span>DNI: {instructor.dni}</span>
            <span>
              {instructor.lastLoginAt
                ? formatDateTime(instructor.lastLoginAt)
                : "Sin conexion"}
            </span>
          </div>
        </div>

        <div className="shrink-0">
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
                aria-label={`Opciones de ${fullName}`}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <EllipsisVertical size={16} aria-hidden="true" />
              </Button>
            }
          >
            {instructor.isActive ? (
              <>
                <PopoverItem
                  icon={<Pencil color="green" />}
                  onClick={() => {
                    onEdit(instructor);
                    setMenuOpen(false);
                  }}
                >
                  Editar
                </PopoverItem>
                <PopoverSeparator />
                <PopoverItem
                  icon={<CalendarDays color="#4ea49c" />}
                  // onClick={() => {
                  //   void navigate({
                  //     to: "/instructors/attendance/$instructorId",
                  //     params: { instructorId: instructor.id },
                  //   });
                  //   setMenuOpen(false);
                  // }}
                >
                  Ver asistencias
                </PopoverItem>
                <PopoverSeparator />
                <PopoverItem
                  icon={<UserX />}
                  variant="danger"
                  onClick={() => {
                    onDelete(instructor);
                    setMenuOpen(false);
                  }}
                >
                  Eliminar
                </PopoverItem>
              </>
            ) : (
              <PopoverItem
                icon={<UserCheck color="#90cbc5" />}
                onClick={() => {
                  onRestore(instructor);
                  setMenuOpen(false);
                }}
              >
                Restaurar
              </PopoverItem>
            )}
          </Popover>
        </div>
      </div>
    </div>
  );
}

InstructorCard.displayName = "InstructorCard";
