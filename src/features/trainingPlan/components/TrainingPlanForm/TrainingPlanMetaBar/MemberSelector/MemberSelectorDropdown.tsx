import { SearchInput } from "@shared/ui";
import type { Member } from "@features/members";
import { useMemberSearchInfinite } from "../../../../hooks/ui/useMemberSearchInfinite";
import { TemplateToggleSection } from "./TemplateToggleSection";
import { MemberSearchList } from "./MemberSearchList";

interface MemberSelectorDropdownProps {
  selectedMember: Member | null;
  isTemplate: boolean;
  templateName: string;
  templateNameError?: string;
  onSelectMember: (member: Member) => void;
  onToggleTemplate: () => void;
  onTemplateNameChange: (value: string) => void;
  onAfterSelect: () => void;
}

export function MemberSelectorDropdown({
  selectedMember,
  isTemplate,
  templateName,
  templateNameError,
  onSelectMember,
  onToggleTemplate,
  onTemplateNameChange,
  onAfterSelect,
}: MemberSelectorDropdownProps) {
  const memberSearch = useMemberSearchInfinite({ enabled: true });

  function handleSelect(member: Member) {
    onSelectMember(member);
    memberSearch.setSearch("");
    onAfterSelect();
  }

  return (
    <div className="flex max-h-[min(30rem,80vh)] w-full flex-col sm:w-95">
      <div className="border-b border-neutral-200 px-3.5 pt-3 pb-2.5">
        <SearchInput
          placeholder="Buscar alumno por nombre"
          onSearch={memberSearch.setSearch}
          delay={300}
        />
      </div>

      <TemplateToggleSection
        isTemplate={isTemplate}
        templateName={templateName}
        templateNameError={templateNameError}
        onToggle={onToggleTemplate}
        onTemplateNameChange={onTemplateNameChange}
      />

      <MemberSearchList
        search={memberSearch.search}
        items={memberSearch.items}
        total={memberSearch.total}
        isLoading={memberSearch.isLoading}
        isFetchingNextPage={memberSearch.isFetchingNextPage}
        hasNextPage={memberSearch.hasNextPage}
        isError={memberSearch.isError}
        scrollRef={memberSearch.scrollRef}
        sentinelRef={memberSearch.sentinelRef}
        selectedMember={isTemplate ? null : selectedMember}
        onSelect={handleSelect}
      />
    </div>
  );
}

MemberSelectorDropdown.displayName = "MemberSelectorDropdown";
