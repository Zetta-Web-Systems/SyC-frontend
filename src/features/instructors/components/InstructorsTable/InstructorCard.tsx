import { useState } from "react";
import {
  CalendarDays,
  EllipsisVertical,
  IdCard,
  Mail,
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
import type { Instructor } from "../../types";
import { getLastLoginInfo } from "../../utils/instructors.utils";

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
    <div className="border-b border-neutral-200 pb-3">
      <div className="flex items-start gap-3">
        <Avatar
          size="md"
          color="primary"
          src={instructor.image ?? null}
          fallback={initials}
          alt={fullName}
        />

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

          <div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
            <Mail size={12} className="text-info" aria-hidden="true" />
            <span>{instructor.email}</span>
          </div>

          <div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
            <Phone size={12} className="text-success" aria-hidden="true" />
            <span>{instructor.phone || "Sin datos"}</span>
          </div>

          <div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
            <MapPin size={12} className="text-warning" aria-hidden="true" />
            <span>{instructor.address || "Sin datos"}</span>
          </div>

          <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <IdCard
                size={12}
                className="text-primary-400"
                aria-hidden="true"
              />
              {instructor.dni}
            </span>
            <Badge intent={lastLogin.intent} size="sm">
              {lastLogin.label}
            </Badge>
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
                  onClick={() => {
                    void navigate({
                      to: "/instructors/attendance/$instructorId",
                      params: { instructorId: instructor.id },
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
    </div>
  );
}

InstructorCard.displayName = "InstructorCard";
