import type { Member } from "@features/members/types";

interface MemberProfileFieldsProps {
  member: Member;
}

export function MemberProfileFields({ member }: MemberProfileFieldsProps) {
  return <div className="flex flex-col gap-4"></div>;
}

MemberProfileFields.displayName = "MemberProfileFields";
