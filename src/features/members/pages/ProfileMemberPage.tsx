import { useMemo } from "react";
import { Spinner } from "@shared/ui";
import {
  PainEvolutionChart,
  WeightEvolutionChart,
} from "@features/memberHistory";
import { ClinicalProfileCard } from "../components/common";
import { MemberProfile } from "../components/MemberProfile/MemberProfile";
import { useMemberQuery } from "../hooks/useMemberQuery";
import { useMembersActions } from "../hooks/useMembersActions";
import { mapClinicalProfileToRiskFlagLikes } from "../lib/memberFormTransformers";

interface ProfileMemberPageProps {
  memberId: string;
}

export default function ProfileMemberPage({
  memberId,
}: ProfileMemberPageProps) {
  const { data: member, isLoading, isError } = useMemberQuery(memberId);

  const { handleOpenEdit } = useMembersActions();

  const memberRiskFlags = useMemo(
    () => mapClinicalProfileToRiskFlagLikes(member?.clinicalProfile),
    [member?.clinicalProfile],
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
          painEvolutionSlot={<PainEvolutionChart memberId={memberId} />}
          weightEvolutionSlot={<WeightEvolutionChart memberId={memberId} />}
          onEdit={handleOpenEdit}
        />
      )}
    </div>
  );
}
