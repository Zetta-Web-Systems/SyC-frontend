import type { ReactNode } from "react";
import type { Member } from "../../types";
import { MemberProfileHeader } from "./MemberProfileSections/MemberProfileHeader";
import { MemberProfileContact } from "./MemberProfileSections/MemberProfileContact";
import { MemberProfileMembership } from "./MemberProfileSections/MemberProfileMembership";
import { MemberProfilePlan } from "./MemberProfileSections/MemberProfilePlan";
import {
  mockMembership,
  mockTrainingPlans,
} from "../../data/memberProfile.mock";

interface MemberProfileProps {
  member: Member;
  clinicalProfileSlot?: ReactNode;
  onEdit: (member: Member) => void;
}

export function MemberProfile({
  member,
  clinicalProfileSlot,
  onEdit,
}: MemberProfileProps) {
  return (
    <div className="flex flex-col gap-6">
      <MemberProfileHeader
        member={member}
        onEdit={onEdit}
        membership={mockMembership}
        plans={mockTrainingPlans}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex flex-col gap-6">
          <MemberProfileContact member={member} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MemberProfileMembership membership={mockMembership} />
            <MemberProfilePlan plans={mockTrainingPlans} />
          </div>
        </div>

        {clinicalProfileSlot && (
          <aside className="lg:sticky lg:top-4 flex flex-col gap-4">
            {clinicalProfileSlot}
          </aside>
        )}
      </div>
    </div>
  );
}

MemberProfile.displayName = "MemberProfile";
