import { useMemo } from "react";
import { X } from "lucide-react";
import { Drawer, IconButton, Spinner } from "@shared/ui";
import { useDisclosure } from "@shared/hooks/useDisclosure";
import {
  ClinicalProfileCard,
  mapClinicalProfileToRiskFlagLikes,
  useMemberQuery,
} from "@features/members";

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
  const {
    data: member,
    isLoading,
    isError,
  } = useMemberQuery(open ? memberId : undefined);

  const bodyDetailModal = useDisclosure();

  const memberRiskFlags = useMemo(
    () => mapClinicalProfileToRiskFlagLikes(member?.clinicalProfile),
    [member?.clinicalProfile],
  );

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
        <IconButton aria-label="Cerrar" onClick={onClose}>
          <X size={16} aria-hidden="true" />
        </IconButton>
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

        {!isLoading && !isError && member && (
          <ClinicalProfileCard
            mode="profile"
            memberRiskFlags={memberRiskFlags}
            bodyDetailModal={bodyDetailModal}
          />
        )}
      </div>
    </Drawer>
  );
}

ClinicalProfileDrawer.displayName = "ClinicalProfileDrawer";
