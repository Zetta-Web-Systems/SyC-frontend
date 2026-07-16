import { History, RefreshCw, CreditCard } from "lucide-react";
import { Card, Badge, Button } from "@shared/ui";
import {
  MEMBER_PLAN_TYPE_LABELS,
  type MemberPlanType,
} from "@features/memberPlans";

interface MemberProfileMembershipProps {
  planType?: MemberPlanType | null;
  onAssign?: () => void;
  onViewHistory?: () => void;
}

export function MemberProfileMembership({
  planType,
  onAssign,
  onViewHistory,
}: MemberProfileMembershipProps) {
  const hasPlan = Boolean(planType);

  return (
    <Card surface="panel" padding="md">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            Membresía
          </span>

          <Badge size="sm" intent={hasPlan ? "success" : "neutral"}>
            {hasPlan ? "Con plan" : "Sin plan"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-800">
          <CreditCard
            size={16}
            className="text-primary-500"
            aria-hidden="true"
          />
          {hasPlan && planType ? (
            <span className="font-medium">
              {MEMBER_PLAN_TYPE_LABELS[planType]}
            </span>
          ) : (
            <span className="italic text-neutral-400">
              Sin membresía asignada
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-col gap-2">
          {onViewHistory && (
            <Button
              variant="ghost"
              intent="neutral"
              size="sm"
              className="w-full"
              onClick={onViewHistory}
            >
              <History size={14} aria-hidden="true" />
              Ver historial
            </Button>
          )}

          {onAssign && (
            <Button
              variant="outline"
              intent="neutral"
              size="sm"
              className="w-full"
              onClick={onAssign}
            >
              <RefreshCw size={14} aria-hidden="true" />
              Asignar / cambiar membresía
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

MemberProfileMembership.displayName = "MemberProfileMembership";
