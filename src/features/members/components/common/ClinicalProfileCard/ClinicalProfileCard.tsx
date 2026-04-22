import { useMemo } from "react";
import { AlertTriangle, Pencil, Plus } from "lucide-react";
import { Badge, Button, Card } from "@shared/ui";
import { Body } from "@shared/components/BodyHighlighter";
import { BODY_PREVIEW_FILL } from "@features/clinicalProfiles";
import { computeBodyParts } from "../../../lib/clinicalProfilePreview";
import type { MemberRiskFlagLike } from "../../../types";

export interface ClinicalProfileCardProps {
  mode: "create" | "edit" | "profile";
  memberRiskFlags?: MemberRiskFlagLike[] | null;
  onOpen?: () => void;
}

export function ClinicalProfileCard({
  mode,
  onOpen,
  memberRiskFlags,
}: ClinicalProfileCardProps) {
  const isEditing = mode === "edit";
  const isProfile = mode === "profile";

  const { bodyParts, activeNamedFlags, activeFlagCount } = useMemo(() => {
    const flags = memberRiskFlags ?? [];
    const active = flags.filter((f) => f.isActive);
    return {
      bodyParts: computeBodyParts(flags),
      activeNamedFlags: active.filter(
        (f): f is MemberRiskFlagLike & { name: string } =>
          typeof f.name === "string" && f.name.length > 0,
      ),
      activeFlagCount: active.length,
    };
  }, [memberRiskFlags]);

  const zoneCount = bodyParts.length;
  const hasData = zoneCount > 0 || activeFlagCount > 0;

  return (
    <Card className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h6 className="flex items-center gap-1.5 text-neutral-500">
          Perfil clínico
        </h6>
        {hasData && !isProfile && (
          <Button variant="solid" intent="primary" size="sm" onClick={onOpen}>
            <Pencil size={12} aria-hidden="true" />
            {isEditing ? "Editar" : "Modificar"}
          </Button>
        )}
      </div>

      {hasData ? (
        <>
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
          </div>

          {activeNamedFlags.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                Banderas de riesgo activas
              </p>
              <ul className="flex flex-col gap-1.5">
                {activeNamedFlags.map((flag) => (
                  <li
                    key={flag.id}
                    className="flex items-start gap-2 rounded-lg border border-error/15 bg-error/5 px-2.5 py-2"
                  >
                    <AlertTriangle
                      size={14}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-error"
                    />
                    <span className="flex-1 text-xs font-medium text-neutral-800">
                      {flag.name}
                    </span>
                    <Badge intent="success" size="sm">
                      Activo
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center">
          <div className="opacity-30">
            <Body
              data={[]}
              side="front"
              scale={0.45}
              defaultFill={BODY_PREVIEW_FILL}
            />
          </div>
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
            {isEditing ? "Completar perfil clínico" : "Agregar perfil clínico"}
          </Button>
        </div>
      )}
    </Card>
  );
}

ClinicalProfileCard.displayName = "ClinicalProfileCard";
