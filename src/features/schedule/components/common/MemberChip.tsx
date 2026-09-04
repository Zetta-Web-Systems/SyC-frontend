import { Lock } from "lucide-react";
import type { MemberSimple } from "@features/members";
import { cn } from "@shared/lib/cn";
import {
  formatMemberFullName,
  formatMemberShortName,
} from "../../lib/memberDisplay";

interface MemberChipProps {
  member: MemberSimple;
  isHeld?: boolean;
  isOverturn?: boolean;
  isHighlighted?: boolean;
  badge?: string;
  className?: string;
}

function buildTitle(
  member: MemberSimple,
  isHeld: boolean,
  isOverturn: boolean,
) {
  const notes = [
    isHeld ? "lugar guardado" : null,
    isOverturn ? "sobreturno" : null,
  ].filter(Boolean);

  const fullName = formatMemberFullName(member);
  return notes.length ? `${fullName} (${notes.join(", ")})` : fullName;
}

export function MemberChip({
  member,
  isHeld = false,
  isOverturn = false,
  isHighlighted = false,
  badge,
  className,
}: MemberChipProps) {
  return (
    <span
      title={buildTitle(member, isHeld, isOverturn)}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-600",
        isHeld &&
          "border-dashed border-secondary-300 bg-secondary-50 text-secondary-700",
        isOverturn && "border-warning bg-warning/20 text-neutral-800",
        isHighlighted && "border-primary-500 bg-primary-100 text-primary-700",
        className,
      )}
    >
      <span className="leading-none">{formatMemberShortName(member)}</span>
      {isHeld && <Lock size={11} aria-hidden="true" className="shrink-0" />}
      {badge && (
        <span className="shrink-0 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] leading-none font-bold text-neutral-500 tabular-nums">
          {badge}
        </span>
      )}
    </span>
  );
}

MemberChip.displayName = "MemberChip";

interface MemberChipOverlayProps {
  member: MemberSimple;
}

export function MemberChipOverlay({ member }: MemberChipOverlayProps) {
  return (
    <span className="inline-flex cursor-grabbing items-center rounded-full border border-primary-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xl ring-4 ring-primary-200/40">
      {formatMemberShortName(member)}
    </span>
  );
}

MemberChipOverlay.displayName = "MemberChipOverlay";
