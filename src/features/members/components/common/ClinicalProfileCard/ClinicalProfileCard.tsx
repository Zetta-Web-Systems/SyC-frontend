import { useMemo } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button, Card } from "@shared/ui";
import { Body } from "@shared/components/BodyHighlighter";
import { BodyDetailModal } from "@shared/components/BodyDetailModal";
import {
  BODY_PREVIEW_FILL,
  ClinicalProfileBodyLegend,
} from "@features/clinicalProfiles";
import { BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import type { DisclosureState } from "@shared/hooks/useDisclosure";
import type { Slug } from "@shared/types/bodyHighlighter.types";
import type { BodyZone } from "@shared/types/bodyZone.types";
import { computeBodyParts } from "../../../lib/clinicalProfilePreview";
import type { MemberRiskFlagLike } from "../../../types";
import { RiskFlagItem } from "./RiskFlagItem";
import { SeverityLegend } from "./SeverityLegend";
import { ZoneDetailsList } from "./ZoneDetailsList";

export interface ClinicalProfileCardProps {
  mode: "create" | "edit" | "profile";
  memberRiskFlags?: MemberRiskFlagLike[] | null;
  onOpen?: () => void;
  bodyDetailModal?: DisclosureState;
}

type NamedFlag = MemberRiskFlagLike & { name: string };

export function ClinicalProfileCard({
  mode,
  onOpen,
  memberRiskFlags,
  bodyDetailModal,
}: ClinicalProfileCardProps) {
  const isEditing = mode === "edit";
  const isProfile = mode === "profile";
  const canOpenDetail = isProfile && !!bodyDetailModal;

  const { bodyParts, namedFlags } = useMemo(() => {
    const flags = memberRiskFlags ?? [];
    const named = flags.filter(
      (f): f is NamedFlag => typeof f.name === "string" && f.name.length > 0,
    );
    const sorted = named.toSorted((a, b) => {
      if (a.isActive === b.isActive) return 0;
      return a.isActive ? -1 : 1;
    });
    return {
      bodyParts: computeBodyParts(flags),
      namedFlags: sorted,
    };
  }, [memberRiskFlags]);

  const zoneCount = bodyParts.length;
  const hasData = zoneCount > 0 || namedFlags.length > 0;

  const bodyBlock = (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="flex items-end justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">
            Frontal
          </span>
          <Body
            data={bodyParts}
            side="front"
            scale={0.55}
            defaultFill={BODY_PREVIEW_FILL}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase">
            Dorsal
          </span>
          <Body
            data={bodyParts}
            side="back"
            scale={0.55}
            defaultFill={BODY_PREVIEW_FILL}
          />
        </div>
      </div>
      <SeverityLegend bodyParts={bodyParts} />
    </div>
  );

  return (
    <>
      <Card className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h6 className="flex items-center gap-1.5 text-neutral-500">
            Perfil clínico
          </h6>
          <div className="flex items-center gap-2">
            {hasData && isProfile && zoneCount > 0 && (
              <span className="text-xs text-neutral-400">
                {zoneCount} {zoneCount === 1 ? "zona" : "zonas"}
              </span>
            )}
            {hasData && !isProfile && (
              <Button
                variant="solid"
                intent="primary"
                size="sm"
                onClick={onOpen}
              >
                <Pencil size={12} aria-hidden="true" />
                {isEditing ? "Editar" : "Modificar"}
              </Button>
            )}
          </div>
        </div>

        {hasData ? (
          <>
            {canOpenDetail && zoneCount > 0 ? (
              <button
                type="button"
                onClick={bodyDetailModal.open}
                className="group flex flex-col gap-2 text-left transition-opacity hover:opacity-90"
                aria-label="Ver perfil clínico en detalle"
              >
                {bodyBlock}
                <span className="self-end text-xs text-neutral-400 transition-colors group-hover:text-neutral-600">
                  Ver detalle →
                </span>
              </button>
            ) : (
              bodyBlock
            )}

            {namedFlags.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                  Banderas de riesgo
                </p>
                <div className="flex flex-col gap-2">
                  {namedFlags.map((flag) => (
                    <RiskFlagItem key={flag.id} flag={flag} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center">
            <Body
              data={[]}
              side="front"
              scale={0.45}
              defaultFill={BODY_PREVIEW_FILL}
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-neutral-600">
                Sin perfil clínico
              </p>
            </div>
            <Button
              intent="primary"
              variant={isEditing ? "outline" : "solid"}
              size="sm"
              onClick={onOpen}
            >
              <Plus size={14} aria-hidden="true" />
              {isEditing
                ? "Completar perfil clínico"
                : "Agregar perfil clínico"}
            </Button>
          </div>
        )}
      </Card>

      {canOpenDetail && (
        <BodyDetailModal
          open={bodyDetailModal.isOpen}
          onClose={bodyDetailModal.close}
          bodyParts={bodyParts}
          defaultFill={BODY_PREVIEW_FILL}
          title="Perfil clínico"
          subtitle={
            zoneCount > 0
              ? `${zoneCount} ${zoneCount === 1 ? "zona afectada" : "zonas afectadas"}`
              : undefined
          }
          legend={<ClinicalProfileBodyLegend />}
          details={<ZoneDetailsList memberRiskFlags={memberRiskFlags ?? []} />}
          getPathLabel={(slug: Slug) => BODY_ZONE_LABELS[slug as BodyZone]}
        />
      )}
    </>
  );
}

ClinicalProfileCard.displayName = "ClinicalProfileCard";
