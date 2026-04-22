import { Card, Badge } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { formatDate } from "@shared/utils/date.utils";

interface Membership {
  planName: string;
  status: "active" | "expired" | "pending";
  startDate: string;
  endDate: string;
  remainingDays: number;
}

interface MemberProfileMembershipProps {
  membership: Membership;
}

function getStatus(status: Membership["status"]) {
  switch (status) {
    case "active":
      return { label: "Vigente", intent: "success" as const };
    case "expired":
      return { label: "Vencida", intent: "error" as const };
    case "pending":
      return { label: "Pendiente", intent: "warning" as const };
  }
}

function getDaysBetween(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);

  const diff = e.getTime() - s.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function MemberProfileMembership({
  membership,
}: MemberProfileMembershipProps) {
  const status = getStatus(membership.status);
  const totalDays = getDaysBetween(membership.startDate, membership.endDate);

  const progress = ((totalDays - membership.remainingDays) / totalDays) * 100;

  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            Membresía
          </span>

          <Badge size="sm" intent={status.intent}>
            {status.label}
          </Badge>
        </div>
        <div className="text-sm text-neutral-800">
          <span className="text-neutral-500">Plan · </span>
          <span className="font-medium">{membership.planName}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {formatDate(membership.startDate)} –{" "}
            {formatDate(membership.endDate)}
          </span>

          <span
            className={cn(
              "font-medium",
              membership.remainingDays <= 5 ? "text-error" : "text-neutral-700",
            )}
          >
            {membership.remainingDays} días restantes
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                membership.remainingDays <= 5 ? "bg-error" : "bg-success",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>{formatDate(membership.startDate)}</span>
            <span>{formatDate(membership.endDate)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

MemberProfileMembership.displayName = "MemberProfileMembership";
