import { useState } from "react";
import {
  CalendarDays,
  DollarSign,
  EllipsisVertical,
  IdCard,
  MapPin,
  Pencil,
  Phone,
  Receipt,
  Target,
  Weight,
  UserCheck,
  UserX,
  FileUser,
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
import { formatDate } from "@shared/utils/date.utils";
import { FeeDueBadge } from "@features/memberPlans";
import type { Member } from "../../types";
import { TRAINING_GOAL_LABELS } from "../../constants";

interface MemberCardProps {
  member: Member;
  onProfile: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
  onRestore: (member: Member) => void;
}

export function MemberCard({
  member,
  onProfile,
  onEdit,
  onDelete,
  onRestore,
}: MemberCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const initials = (
    member.name.charAt(0) + member.lastname.charAt(0)
  ).toUpperCase();
  const fullName = `${member.name} ${member.lastname}`;

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <Avatar
          size="lg"
          color="primary"
          src={null}
          fallback={initials}
          alt={fullName}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {fullName}
          </p>
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <IdCard size={12} className="text-primary-400" aria-hidden="true" />
            DNI: {member.dni}
          </span>
          {member.email && (
            <span className="truncate text-xs text-primary-500">
              {member.email}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Badge intent={member.isActive ? "success" : "error"} size="sm">
            {member.isActive ? "ACTIVO" : "INACTIVO"}
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
            {member.isActive ? (
              <>
                <PopoverItem
                  icon={<FileUser color="#3e4c93" />}
                  onClick={() => {
                    onProfile(member);
                    setMenuOpen(false);
                  }}
                >
                  Ver ficha completa
                </PopoverItem>
                <PopoverSeparator />
                <PopoverItem
                  icon={<DollarSign color="green" />}
                  onClick={() => {
                    void navigate({
                      to: "/billing",
                      search: {
                        memberId: member.id,
                        memberName: `${member.name} ${member.lastname}`,
                      },
                    });
                    setMenuOpen(false);
                  }}
                >
                  Ver cuotas
                </PopoverItem>
                <PopoverItem
                  icon={<CalendarDays color="#4ea49c" />}
                  onClick={() => {
                    void navigate({
                      to: "/attendances",
                      search: {
                        type: "MEMBER" as const,
                        personId: member.personId,
                        personName: `${member.name} ${member.lastname}`,
                      },
                    });
                    setMenuOpen(false);
                  }}
                >
                  Asistencias
                </PopoverItem>
                <PopoverItem
                  icon={<Pencil color="green" />}
                  onClick={() => {
                    onEdit(member);
                    setMenuOpen(false);
                  }}
                >
                  Editar
                </PopoverItem>
                <PopoverSeparator />
                <PopoverItem
                  icon={<UserX />}
                  variant="danger"
                  onClick={() => {
                    onDelete(member);
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
                  onRestore(member);
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
          {member.address || "Sin dirección registrada"}
        </span>
        <div className="flex items-center gap-4 justify-center">
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-success" aria-hidden="true" />
            {member.phone || "Sin registro"}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={12} className="text-info" aria-hidden="true" />
            {member.emergencyPhone || "Sin registro"}
          </span>
        </div>
        <div className="flex items-center gap-4 justify-center">
          <span className="flex items-center gap-1">
            <CalendarDays
              size={12}
              className="text-neutral-400"
              aria-hidden="true"
            />
            {member.bornDate ? formatDate(member.bornDate) : "Sin fecha"}
          </span>
          <span className="flex items-center gap-1">
            <Weight size={12} className="text-warning" aria-hidden="true" />
            {member.currentWeight ? `${member.currentWeight} kg` : "Sin peso"}
          </span>
        </div>
        <span className="flex items-center gap-1 justify-center">
          <Target size={12} className="text-primary-400" aria-hidden="true" />
          {member.trainingGoal
            ? TRAINING_GOAL_LABELS[member.trainingGoal]
            : "Sin objetivo"}
        </span>
        <span className="flex items-center gap-1 justify-center">
          <Receipt size={12} className="text-neutral-400" aria-hidden="true" />
          {member.fee ? <FeeDueBadge fee={member.fee} /> : "Sin cuota"}
        </span>
      </div>
    </div>
  );
}

MemberCard.displayName = "MemberCard";
