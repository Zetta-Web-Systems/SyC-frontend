import { useFormContext } from "react-hook-form";
import { WizardModal } from "@shared/ui";
import type { BodyZone } from "@shared/types/bodyZone.types";
import type { RiskFlag } from "@features/riskFlags";
import { WIZARD_STEP } from "../../../../constants";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import type { ClinicalProfileFormSchema } from "../../../../schemas/clinicalProfile.schema";
import { NotesStep } from "./NotesStep";
import { ZonesStep } from "./ZonesStep";

interface CurrentStatusModalProps {
  open: boolean;
  onClose: () => void;
  riskFlag: RiskFlag;
  memberRiskFlagIndex: number;
}

export function CurrentStatusModal({
  open,
  onClose,
  riskFlag,
  memberRiskFlagIndex,
}: CurrentStatusModalProps) {
  const { trigger } = useFormContext<ClinicalProfileFormSchema>();
  const affectedZones = riskFlag.affectedZones as BodyZone[] | undefined;

  return (
    <WizardModal open={open} onClose={onClose} title={riskFlag.name}>
      <WizardModal.Step
        name={WIZARD_STEP.ZONES}
        stepLabel="Estados por zona"
        onNext={() =>
          trigger(memberRiskFlagPaths.currentStatusPath(memberRiskFlagIndex))
        }
      >
        <ZonesStep
          riskFlagIndex={memberRiskFlagIndex}
          affectedZones={affectedZones}
        />
      </WizardModal.Step>
      <WizardModal.Step
        name={WIZARD_STEP.NOTES}
        stepLabel="Notas generales"
        onSubmit={() => trigger(memberRiskFlagPaths.notes(memberRiskFlagIndex))}
      >
        <NotesStep riskFlagIndex={memberRiskFlagIndex} />
      </WizardModal.Step>
    </WizardModal>
  );
}

CurrentStatusModal.displayName = "CurrentStatusModal";
