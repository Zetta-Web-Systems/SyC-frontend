import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Pencil, X } from "lucide-react";
import { Button, Drawer, IconButton, Spinner } from "@shared/ui";
import { useDisclosure } from "@shared/hooks/useDisclosure";
import {
  ClinicalProfileCard,
  mapClinicalProfileToRiskFlagLikes,
} from "@features/members";
import { useClinicalProfileQuery } from "@features/clinicalProfiles";
import { useSaveTrainingPlanDraft } from "../../../../hooks/form/useSaveTrainingPlanDraft";

interface ClinicalProfileDrawerProps {
  memberId: string;
  memberName: string;
  open: boolean;
  onClose: () => void;
}

export function ClinicalProfileDrawer({
  memberId,
  memberName,
  open,
  onClose,
}: ClinicalProfileDrawerProps) {
  const navigate = useNavigate();
  const { stashDraft } = useSaveTrainingPlanDraft();

  const {
    data: clinicalProfile,
    isLoading,
    isError,
  } = useClinicalProfileQuery(open ? memberId : undefined);

  const bodyDetailModal = useDisclosure();

  const memberRiskFlags = useMemo(
    () => mapClinicalProfileToRiskFlagLikes(clinicalProfile),
    [clinicalProfile],
  );

  const hasProfile = !!clinicalProfile;

  function openClinicalProfile() {
    stashDraft(null);
    void navigate({
      to: "/members/$memberId/clinical-profile",
      params: { memberId },
      search: { from: "training-plan" },
    });
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      ariaLabel={`Perfil clínico de ${memberName}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 p-4">
        <div className="min-w-0">
          <h5 className="truncate font-semibold text-neutral-900">
            Perfil clínico
          </h5>
          <p className="truncate text-xs text-neutral-500">{memberName}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {hasProfile && (
            <Button
              intent="primary"
              variant="outline"
              size="sm"
              onClick={openClinicalProfile}
            >
              <Pencil size={14} aria-hidden="true" />
              <span className="hidden xs:inline">Editar</span>
            </Button>
          )}
          <IconButton aria-label="Cerrar" onClick={onClose}>
            <X size={16} aria-hidden="true" />
          </IconButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
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
            No se pudo cargar el perfil clínico.
          </p>
        )}

        {!isLoading && !isError && (
          <ClinicalProfileCard
            mode="profile"
            onOpen={openClinicalProfile}
            memberRiskFlags={memberRiskFlags}
            bodyDetailModal={bodyDetailModal}
          />
        )}
      </div>
    </Drawer>
  );
}

ClinicalProfileDrawer.displayName = "ClinicalProfileDrawer";
