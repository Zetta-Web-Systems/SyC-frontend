import { useMemo } from "react";
import { Spinner } from "@shared/ui";
import { ClinicalProfileCard } from "../components/common";
import { MemberProfile } from "../components/MemberProfile/MemberProfile";
import { useMemberQuery } from "../hooks/useMemberQuery";
import { useMembersActions } from "../hooks/useMembersActions";
import type { MemberRiskFlagLike } from "../types";

interface ProfileMemberPageProps {
  memberId: string;
}

export default function ProfileMemberPage({
  memberId,
}: ProfileMemberPageProps) {
  const { data: member, isLoading, isError } = useMemberQuery(memberId);

  const { handleOpenEdit } = useMembersActions();

  const memberRiskFlags = useMemo<MemberRiskFlagLike[]>(
    () =>
      member?.clinicalProfile?.memberRiskFlags.map((mrf) => ({
        id: mrf.id,
        name: mrf.riskFlag.name,
        isActive: mrf.isActive,
        currentStatus: mrf.currentStatus.map((cs) => ({
          bodyZone: cs.bodyZone,
          side: cs.side ?? null,
          painLevel: cs.painLevel,
        })),
      })) ?? [],
    [member?.clinicalProfile?.memberRiskFlags],
  );

  return (
    <div className="flex flex-col gap-4">
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <p
          role="alert"
          className="rounded-xl border border-error bg-error/5 p-4 text-sm text-error"
        >
          No se pudo cargar el alumno.
        </p>
      )}

      {member && (
        <MemberProfile
          member={member}
          clinicalProfileSlot={
            <ClinicalProfileCard
              mode="profile"
              memberRiskFlags={memberRiskFlags}
            />
          }
          onEdit={handleOpenEdit}
        />
      )}
    </div>
  );
}
