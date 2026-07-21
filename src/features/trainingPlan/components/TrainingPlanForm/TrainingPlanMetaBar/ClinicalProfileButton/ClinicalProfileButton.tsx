import { HeartPulse } from "lucide-react";
import { Button, IconButton } from "@shared/ui";
import { useDisclosure } from "@shared/hooks/useDisclosure";
import type { Member } from "@features/members";
import { memberFullName } from "../../../../lib/memberDisplay";
import { ClinicalProfileDrawer } from "../ClinicalProfileButton/ClinicalProfileDrawer";

interface ClinicalProfileButtonProps {
  member: Member | null;
  compact?: boolean;
}

export function ClinicalProfileButton({
  member,
  compact = false,
}: ClinicalProfileButtonProps) {
  const { isOpen, open, close } = useDisclosure();

  if (!member) return null;

  return (
    <>
      {compact ? (
        <IconButton
          intent="primary"
          variant="soft"
          size="xs"
          onClick={open}
          aria-label={`Ver perfil clínico de ${memberFullName(member)}`}
        >
          <HeartPulse size={14} aria-hidden="true" />
        </IconButton>
      ) : (
        <Button
          type="button"
          intent="neutral"
          variant="outline"
          size="sm"
          onClick={open}
          className="shrink-0"
        >
          <HeartPulse size={14} aria-hidden="true" />
          <span className="hidden sm:inline">Perfil clínico</span>
        </Button>
      )}

      <ClinicalProfileDrawer
        memberId={member.id}
        memberName={memberFullName(member)}
        open={isOpen}
        onClose={close}
      />
    </>
  );
}

ClinicalProfileButton.displayName = "ClinicalProfileButton";
