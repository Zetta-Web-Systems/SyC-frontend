import { Avatar, Badge, Card, Button } from "@shared/ui";
import type { Member } from "@features/members/types";
import { Calendar, Pencil } from "lucide-react";

interface MemberProfileHeaderProps {
  member: Member;
}

export function MemberProfileHeader({ member }: MemberProfileHeaderProps) {
  const initials = (
    member.name.charAt(0) + member.lastname.charAt(0)
  ).toUpperCase();
  const fullName = `${member.name} ${member.lastname}`;

  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex flex-start gap-6 flex-wrap">
        <Avatar
          size="xl"
          color="primary"
          src={member.image ?? null}
          fallback={initials}
          alt={fullName}
          className="border-2 border-primary-200"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold tracking-tight leading-tight text-neutral-900">
                {fullName}
              </h2>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <Badge
                  intent={member.isActive ? "success" : "error"}
                  variant="dot"
                >
                  {member.isActive ? "ACTIVO" : "INACTIVO"}
                </Badge>
                <Badge intent="info" variant="dot">
                  Dato 2 (Podría ser el plan/membresía, tipo "PLAN VIGENTE" -
                  "VENCE EN X DIAS" - "VENCIDO")
                </Badge>
                <Badge intent="neutral" variant="dot">
                  Dato 3 (Podría ser si tiene o no plan, tipo "PLAN ASIGNADO" -
                  "Sin Plan" - "PLAN DESACTUALIZADO")
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" intent="primary" size="md">
                <Calendar size={14} /> Ver asistencias
              </Button>
              <Button variant="solid" intent="primary" size="md">
                <Pencil size={14} /> Editar alumno
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

MemberProfileHeader.displayName = "MemberProfileHeader";
