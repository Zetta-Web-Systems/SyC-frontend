import { useState } from "react";
import {
  CalendarDays,
  Clock,
  EllipsisVertical,
  IdCard,
  MapPin,
  Pencil,
  Phone,
  UserCheck,
  UserX,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  Avatar,
  Badge,
  Button,
  Popover,
  PopoverItem,
  PopoverSeparator,
} from "@shared/ui";
import { getLastLoginInfo } from "@shared/utils/date.utils";
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
  const navigate = useNavigate();

  const initials = (
    instructor.name.charAt(0) + instructor.lastname.charAt(0)
  ).toUpperCase();
  const fullName = `${instructor.name} ${instructor.lastname}`;
  const lastLogin = getLastLoginInfo(instructor.lastLoginAt);

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <Avatar
          size="lg"
          color="primary"
          src={instructor.image ?? null}
          fallback={initials}
          alt={fullName}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {fullName}
          </p>
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <IdCard size={12} className="text-primary-400" aria-hidden="true" />
            DNI: {instructor.dni}
          </span>
          <span className="truncate text-xs text-primary-500">
            {instructor.email}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Badge intent={instructor.isActive ? "success" : "error"} size="sm">
            {instructor.isActive ? "ACTIVO" : "INACTIVO"}
          </Badge>
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
                  onClick={() => {
                    void navigate({
                      to: "/attendances",
                      search: {
                        type: "INSTRUCTOR" as const,
                        personId: instructor.id,
                      },
                    });
                    setMenuOpen(false);
                  }}
                >
                  Asistencias
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

      <hr className="border-neutral-200 my-3" />

      <div className="flex flex-col text-neutral-500 gap-1 text-xs">
        <span className="flex items-center gap-1 justify-center">
          <MapPin size={12} className="text-error" aria-hidden="true" />
          {instructor.address || "Sin dirección registrada"}
        </span>
        <div className="flex items-center gap-4 justify-center">
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-success" aria-hidden="true" />
            {instructor.phone || "Sin registro"}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-info" aria-hidden="true" />
            {instructor.emergencyPhone || "Sin registro"}
          </span>
        </div>
        <span className="flex items-center gap-1 justify-center">
          <Clock size={12} className="text-neutral-400" aria-hidden="true" />
          Última conexión: {lastLogin.label.toLowerCase()}
        </span>
      </div>
    </div>
  );
}

InstructorCard.displayName = "InstructorCard";
