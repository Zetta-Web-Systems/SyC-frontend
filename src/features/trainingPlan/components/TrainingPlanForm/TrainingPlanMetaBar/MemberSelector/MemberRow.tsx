import { Check } from "lucide-react";
import { Avatar, Pill } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { Member } from "@features/members";
import {
  formatMemberMeta,
  memberFullName,
  memberInitials,
} from "../../../../lib/memberDisplay";

interface MemberRowProps {
  member: Member;
  isSelected: boolean;
  onSelect: (member: Member) => void;
}

export function MemberRow({ member, isSelected, onSelect }: MemberRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className={cn(
        "my-px flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors",
        isSelected ? "bg-primary-500/10" : "hover:bg-neutral-50",
      )}
    >
      <Avatar
        size="sm"
        color="primary"
        src={member.image}
        fallback={memberInitials(member)}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
          <span className="truncate">{memberFullName(member)}</span>
          {!member.isActive && (
            <Pill size="xs" intent="neutral" tone="soft" uppercase>
              Inactivo
            </Pill>
          )}
        </div>
        <div className="mt-px truncate text-xs text-neutral-500">
          {formatMemberMeta(member)}
        </div>
      </div>
      {isSelected && (
        <Check
          size={14}
          aria-hidden="true"
          className="shrink-0 text-primary-600"
        />
      )}
    </button>
  );
}

MemberRow.displayName = "MemberRow";
