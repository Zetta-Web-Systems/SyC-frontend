import { Calendar, Pencil } from "lucide-react";
import { Avatar, Badge, Card, Button } from "@shared/ui";
import type { Member } from "../../../types";
import { Link } from "@tanstack/react-router";

interface Membership {
  status?: "active" | "expired" | "pending";
}

interface TrainingPlan {
  name: string;
  since?: string;
  until?: string;
}

interface TrainingPlans {
  current?: TrainingPlan;
  previous?: TrainingPlan;
}

interface MemberProfileHeaderProps {
  member: Member;
  membership?: Membership;
  plans?: TrainingPlans;
  onEdit: (member: Member) => void;
}

function getMembershipBadge(status?: Membership["status"]) {
  switch (status) {
    case "active":
      return { label: "VIGENTE", intent: "success" as const };
    case "expired":
      return { label: "VENCIDO", intent: "error" as const };
    default:
      return null;
  }
}

function getPlanBadge(plan?: TrainingPlan) {
  if (!plan) {
    return { label: "SIN PLANIFICACIÓN", intent: "warning" as const };
  }
  return { label: "ACTIVA", intent: "success" as const };
}

export function MemberProfileHeader({
  member,
  membership,
  plans,
  onEdit,
}: MemberProfileHeaderProps) {
  const initials = (
    member.name.charAt(0) + member.lastname.charAt(0)
  ).toUpperCase();

  const fullName = `${member.name} ${member.lastname}`;

  const membershipBadge = getMembershipBadge(membership?.status);
  const planBadge = getPlanBadge(plans?.current);

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

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                    Alumno:
                  </span>
                  <Badge
                    intent={member.isActive ? "success" : "error"}
                    variant="dot"
                  >
                    {member.isActive ? "ACTIVO" : "INACTIVO"}
                  </Badge>
                </div>

                {membershipBadge && (
                  <>
                    <div className="w-px h-4 bg-neutral-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                        Plan:
                      </span>
                      <Badge intent={membershipBadge.intent} variant="dot">
                        {membershipBadge.label}
                      </Badge>
                    </div>
                  </>
                )}

                {planBadge && (
                  <>
                    <div className="w-px h-4 bg-neutral-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                        Planificación:
                      </span>
                      <Badge intent={planBadge.intent} variant="dot">
                        {planBadge.label}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Link to="/attendances" search={{ type: "MEMBER" as const }}>
                <Button variant="outline" intent="primary" size="md">
                  <Calendar size={14} /> Ver asistencias
                </Button>
              </Link>

              <Button
                variant="solid"
                intent="primary"
                size="md"
                onClick={() => onEdit(member)}
              >
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
