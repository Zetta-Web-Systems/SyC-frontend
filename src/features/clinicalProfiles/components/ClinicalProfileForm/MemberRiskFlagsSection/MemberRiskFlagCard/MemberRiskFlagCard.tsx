import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@shared/lib/cn";
import type { RiskFlag } from "@features/riskFlags";
import {
  BODY_ZONE_GROUP_ACCENT_CLASS,
  MAX_VISIBLE_ZONES,
} from "../../../../constants";
import { getDominantGroup } from "../../../../lib/bodyZoneGrouping";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import type { ClinicalProfileFormSchema } from "../../../../schemas/clinicalProfile.schema";
import { CurrentStatusModal } from "../CurrentStatusModal";
import { MemberRiskFlagCardActions } from "./MemberRiskFlagCardActions";
import { MemberRiskFlagCardHeader } from "./MemberRiskFlagCardHeader";
import { NotesPreview } from "./NotesPreview";
import { StatusesByZone } from "./StatusesByZone";
import { ZoneBadgeList } from "./ZoneBadgeList";

interface MemberRiskFlagCardProps {
  index: number;
  riskFlag: RiskFlag;
  onRemove: () => void;
}

export function MemberRiskFlagCard({
  index,
  riskFlag,
  onRemove,
}: MemberRiskFlagCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { control } = useFormContext<ClinicalProfileFormSchema>();
  const isActive = useWatch({
    control,
    name: memberRiskFlagPaths.isActive(index),
  }) as boolean;

  const affectedZones = riskFlag.affectedZones ?? [];
  const dominantGroup = getDominantGroup(affectedZones);
  const accentClass = dominantGroup
    ? (BODY_ZONE_GROUP_ACCENT_CLASS[dominantGroup] ?? "border-l-neutral-300")
    : "border-l-neutral-300";

  const dimContentClass = cn(
    "transition-opacity duration-200",
    !isActive && "opacity-45",
  );

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-4 transition-all",
        isActive
          ? cn("border-neutral-200 bg-white", accentClass)
          : "border-neutral-300 border-l-neutral-300 bg-neutral-50",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={dimContentClass}>
          <MemberRiskFlagCardHeader
            name={riskFlag.name}
            affectedZones={affectedZones}
          />
        </div>
        <MemberRiskFlagCardActions
          index={index}
          riskFlagName={riskFlag.name}
          guideline={riskFlag.medicalGuideline}
          onEdit={() => setEditModalOpen(true)}
          onRemove={onRemove}
        />
      </div>

      <div className={cn("flex flex-col", dimContentClass)}>
        <ZoneBadgeList zones={affectedZones} max={MAX_VISIBLE_ZONES} />
        <StatusesByZone index={index} />
        <NotesPreview index={index} />
      </div>

      <CurrentStatusModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        riskFlag={riskFlag}
        memberRiskFlagIndex={index}
      />
    </div>
  );
}

MemberRiskFlagCard.displayName = "MemberRiskFlagCard";
