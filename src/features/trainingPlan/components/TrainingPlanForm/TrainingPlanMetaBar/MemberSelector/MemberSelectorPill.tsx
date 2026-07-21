import { useDropdown } from "@shared/hooks/useDropdown";
import { DropdownPanel } from "@shared/components/DropdownPanel";
import type { Member } from "@features/members";
import { MemberSelectorDropdown } from "./MemberSelectorDropdown";
import { PillTrigger } from "./PillTrigger";

interface MemberSelectorPillProps {
  selectedMember: Member | null;
  isTemplate: boolean;
  templateName: string;
  memberError?: string;
  templateNameError?: string;
  onSelectMember: (member: Member) => void;
  onToggleTemplate: () => void;
  onTemplateNameChange: (value: string) => void;
}

export function MemberSelectorPill({
  selectedMember,
  isTemplate,
  templateName,
  memberError,
  templateNameError,
  onSelectMember,
  onToggleTemplate,
  onTemplateNameChange,
}: MemberSelectorPillProps) {
  const { isOpen, toggle, close, containerRef } = useDropdown<HTMLDivElement>();

  const hasError = !!memberError && !isTemplate;

  return (
    <div ref={containerRef} className="relative w-full sm:w-auto">
      <PillTrigger
        isOpen={isOpen}
        hasError={hasError}
        isTemplate={isTemplate}
        selectedMember={selectedMember}
        templateName={templateName}
        onClick={toggle}
      />

      <DropdownPanel
        open={isOpen}
        side="bottom"
        align="start"
        elevation="lg"
        width="trigger"
        className="top-[calc(100%+6px)]"
      >
        <MemberSelectorDropdown
          selectedMember={selectedMember}
          isTemplate={isTemplate}
          templateName={templateName}
          templateNameError={templateNameError}
          onSelectMember={onSelectMember}
          onToggleTemplate={onToggleTemplate}
          onTemplateNameChange={onTemplateNameChange}
          onAfterSelect={close}
        />
      </DropdownPanel>

      {hasError && !isOpen && (
        <p role="alert" className="mt-1 text-xs text-error">
          {memberError}
        </p>
      )}
    </div>
  );
}

MemberSelectorPill.displayName = "MemberSelectorPill";
