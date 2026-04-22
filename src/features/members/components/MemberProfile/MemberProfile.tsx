import type { ReactNode } from "react";
import type { Member } from "../../types";
import { MemberProfileFields } from "./MemberProfileFields/MemberProfileFields";
import { MemberProfileHeader } from "./MemberProfileFields/MemberProfileHeader";

interface MemberProfileProps {
  member: Member;
  onCancel: () => void;
  clinicalProfileSlot?: ReactNode;
}

export function MemberProfile({
  member,
  clinicalProfileSlot,
}: MemberProfileProps) {
  return (
    <>
      <MemberProfileHeader member={member} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <MemberProfileFields member={member} />

        {clinicalProfileSlot && (
          <aside className="lg:sticky lg:top-4">{clinicalProfileSlot}</aside>
        )}
      </div>
    </>
  );
}

MemberProfile.displayName = "MemberProfile";
