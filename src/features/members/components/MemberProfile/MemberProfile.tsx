import { useState } from "react";
import type { ReactNode } from "react";
import {
  AssignMembershipModal,
  MembershipHistoryModal,
} from "@features/memberPlans";
import { MemberTurnHistoryModal } from "@features/schedule";
import type { Member } from "../../types";
import { MemberProfileHeader } from "./MemberProfileSections/MemberProfileHeader";
import { MemberProfileContact } from "./MemberProfileSections/MemberProfileContact";
import { MemberProfileMembership } from "./MemberProfileSections/MemberProfileMembership";
import { MemberProfilePlan } from "./MemberProfileSections/MemberProfilePlan";
import { MemberProfileSchedule } from "./MemberProfileSections/MemberProfileSchedule";
import { mockTrainingPlans } from "../../data/memberProfile.mock";

interface MemberProfileProps {
  member: Member;
  clinicalProfileSlot?: ReactNode;
  painEvolutionSlot?: ReactNode;
  weightEvolutionSlot?: ReactNode;
  onEdit: (member: Member) => void;
}

export function MemberProfile({
  member,
  clinicalProfileSlot,
  painEvolutionSlot,
  weightEvolutionSlot,
  onEdit,
}: MemberProfileProps) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [scheduleHistoryOpen, setScheduleHistoryOpen] = useState(false);

  const memberName = `${member.name} ${member.lastname}`;

  return (
    <div className="flex flex-col gap-6">
      <MemberProfileHeader
        member={member}
        onEdit={onEdit}
        plans={mockTrainingPlans}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex flex-col gap-6">
          <MemberProfileContact member={member} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <MemberProfileMembership
              planType={member.memberPlanType}
              fee={member.fee}
              onAssign={() => setAssignOpen(true)}
              onViewHistory={() => setHistoryOpen(true)}
            />
            <MemberProfilePlan plans={mockTrainingPlans} />

            <MemberProfileSchedule
              timeSlots={member.timeSlots}
              onViewHistory={() => setScheduleHistoryOpen(true)}
            />
          </div>

          {painEvolutionSlot}
          {weightEvolutionSlot}
        </div>

        {clinicalProfileSlot && (
          <aside className="lg:sticky lg:top-4 flex flex-col gap-4">
            {clinicalProfileSlot}
          </aside>
        )}
      </div>

      <AssignMembershipModal
        memberId={member.id}
        memberName={memberName}
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
      />

      <MembershipHistoryModal
        memberId={member.id}
        memberName={memberName}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      <MemberTurnHistoryModal
        memberId={member.id}
        memberName={memberName}
        open={scheduleHistoryOpen}
        onClose={() => setScheduleHistoryOpen(false)}
      />
    </div>
  );
}

MemberProfile.displayName = "MemberProfile";
