import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button, Spinner } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { ClinicalProfileCard } from "../components/common";
import { MemberProfile } from "../components/MemberProfile/MemberProfile";
import { useMemberQuery } from "../hooks/useMemberQuery";
import type { MemberRiskFlagLike } from "../types";

interface ProfileMemberPageProps {
  memberId: string;
}

export default function ProfileMemberPage({
  memberId,
}: ProfileMemberPageProps) {
  const navigate = useNavigate();
  const { data: member, isLoading, isError } = useMemberQuery(memberId);

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

  function handleBack() {
    navigate({ to: "/members" });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={`Ficha completa: ${member?.name} ${member?.lastname}`}
        description="hola"
        actions={
          <Button intent="neutral" variant="outline" onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver</span>
          </Button>
        }
      />

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
          onCancel={handleBack}
          clinicalProfileSlot={
            <ClinicalProfileCard
              mode="profile"
              memberRiskFlags={memberRiskFlags}
            />
          }
        />
      )}
    </div>
  );
}
