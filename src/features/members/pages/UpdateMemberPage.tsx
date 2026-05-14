import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button, Spinner } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { MemberForm } from "../components/MembersList/MemberForm/MemberForm";
import { ClinicalProfileCard } from "../components/common";
import { useMemberQuery } from "../hooks/useMemberQuery";
import { useUpdateMemberMutation } from "../hooks/mutations/useUpdateMemberMutation";
import { mapClinicalProfileToRiskFlagLikes } from "../lib/memberFormTransformers";
import type { UpdateMemberSchema } from "../schemas/member.schema";

interface UpdateMemberPageProps {
  memberId: string;
}

export default function UpdateMemberPage({ memberId }: UpdateMemberPageProps) {
  const navigate = useNavigate();
  const router = useRouter();
  const mutation = useUpdateMemberMutation();
  const { data: member, isLoading, isError } = useMemberQuery(memberId);
  const [navigating, setNavigating] = useState(false);

  const memberRiskFlags = useMemo(
    () => mapClinicalProfileToRiskFlagLikes(member?.clinicalProfile),
    [member?.clinicalProfile],
  );

  function goToList() {
    flushSync(() => setNavigating(true));
    navigate({ to: "/members" });
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      navigate({ to: "/members" });
    }
  }

  function handleUpdate(data: UpdateMemberSchema) {
    if (!member) return;
    if (Object.keys(data).length === 0) {
      goToList();
      return;
    }
    confirm({
      intent: "warning",
      title: "Modificar alumno",
      description: `¿Estás seguro que deseas modificar a ${member.name} ${member.lastname}?`,
      confirmLabel: "Modificar",
      onConfirm: () => {
        const { deleteImage, ...rest } = data;
        const normalized: Record<string, unknown> = {
          ...rest,
          image: rest.image ?? undefined,
        };

        if (deleteImage) {
          normalized.deleteImage = true;
          delete normalized.image;
        }

        mutation.mutate(
          { id: member.id, dto: normalized },
          { onSuccess: () => goToList() },
        );
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Editar alumno"
        description="Modifica la información del alumno"
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
        <MemberForm
          member={member}
          onSubmit={handleUpdate}
          onCancel={handleBack}
          isPending={mutation.isPending}
          mutation={mutation}
          guardUnsavedChanges={!navigating}
          guardAllowNavigationTo={["/members/$memberId/clinical-profile"]}
          clinicalProfileSlot={
            <ClinicalProfileCard
              mode="edit"
              memberRiskFlags={memberRiskFlags}
              onOpen={() =>
                navigate({
                  to: "/members/$memberId/clinical-profile",
                  params: { memberId: member.id },
                  search: { from: "update" },
                })
              }
            />
          }
        />
      )}
    </div>
  );
}
