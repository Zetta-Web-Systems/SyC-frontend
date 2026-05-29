import { FileText, User } from "lucide-react";
import { Avatar, IconBox } from "@shared/ui";
import type { Member } from "@features/members";
import { memberInitials } from "../../../../lib/memberDisplay";

interface TriggerAvatarProps {
  isTemplate: boolean;
  selectedMember: Member | null;
}

export function TriggerAvatar({
  isTemplate,
  selectedMember,
}: TriggerAvatarProps) {
  if (isTemplate) {
    return (
      <IconBox size="md" shape="full" intent="primary" tone="soft">
        <FileText size={15} aria-hidden="true" />
      </IconBox>
    );
  }
  if (selectedMember) {
    return (
      <Avatar
        size="sm"
        color="primary"
        src={selectedMember.image}
        fallback={memberInitials(selectedMember)}
      />
    );
  }
  return (
    <IconBox size="md" shape="full" intent="neutral" tone="soft">
      <User size={14} aria-hidden="true" />
    </IconBox>
  );
}

TriggerAvatar.displayName = "TriggerAvatar";
