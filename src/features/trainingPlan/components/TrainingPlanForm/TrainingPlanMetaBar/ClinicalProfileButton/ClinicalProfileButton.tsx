import { HeartPulse } from "lucide-react";
import { Button } from "@shared/ui";
import { useDisclosure } from "@shared/hooks/useDisclosure";
import type { Member } from "@features/members";
import { memberFullName } from "../../../../lib/memberDisplay";
import { ClinicalProfileDrawer } from "../ClinicalProfileButton/ClinicalProfileDrawer";

interface ClinicalProfileButtonProps {
  member: Member | null;
}

export function ClinicalProfileButton({ member }: ClinicalProfileButtonProps) {
  const { isOpen, open, close } = useDisclosure();

  if (!member) return null;

  return (
    <>
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
