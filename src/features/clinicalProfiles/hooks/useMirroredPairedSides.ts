import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { memberRiskFlagPaths } from "../lib/pathBuilders";
import { arePairedSidesInSync } from "../lib/pairedSides";
import type { ClinicalProfileFormSchema } from "../schemas/clinicalProfile.schema";

interface UseMirroredPairedSidesParams {
  riskFlagIndex: number;
  leftStatusIndex: number;
  rightStatusIndex: number;
}

interface UseMirroredPairedSidesResult {
  mirror: boolean;
  setMirror: (value: boolean) => void;
  leftPainPath: ReturnType<typeof memberRiskFlagPaths.painLevel>;
  rightPainPath: ReturnType<typeof memberRiskFlagPaths.painLevel>;
  leftPhasePath: ReturnType<typeof memberRiskFlagPaths.movementPhase>;
  rightPhasePath: ReturnType<typeof memberRiskFlagPaths.movementPhase>;
}

export function useMirroredPairedSides({
  riskFlagIndex,
  leftStatusIndex,
  rightStatusIndex,
}: UseMirroredPairedSidesParams): UseMirroredPairedSidesResult {
  const { control, getValues, setValue } =
    useFormContext<ClinicalProfileFormSchema>();

  const leftPainPath = memberRiskFlagPaths.painLevel(
    riskFlagIndex,
    leftStatusIndex,
  );
  const rightPainPath = memberRiskFlagPaths.painLevel(
    riskFlagIndex,
    rightStatusIndex,
  );
  const leftPhasePath = memberRiskFlagPaths.movementPhase(
    riskFlagIndex,
    leftStatusIndex,
  );
  const rightPhasePath = memberRiskFlagPaths.movementPhase(
    riskFlagIndex,
    rightStatusIndex,
  );

  const [mirror, setMirror] = useState(() =>
    arePairedSidesInSync({
      leftPain: getValues(leftPainPath) as number,
      rightPain: getValues(rightPainPath) as number,
      leftPhase: getValues(leftPhasePath) as string | undefined,
      rightPhase: getValues(rightPhasePath) as string | undefined,
    }),
  );

  const leftPain = useWatch({ control, name: leftPainPath });
  const leftPhase = useWatch({ control, name: leftPhasePath });

  useEffect(() => {
    if (!mirror) return;
    setValue(rightPainPath, leftPain, {
      shouldDirty: true,
      shouldValidate: false,
    });
    setValue(rightPhasePath, leftPhase, {
      shouldDirty: true,
      shouldValidate: false,
    });
  }, [mirror, leftPain, leftPhase, rightPainPath, rightPhasePath, setValue]);

  return {
    mirror,
    setMirror,
    leftPainPath,
    rightPainPath,
    leftPhasePath,
    rightPhasePath,
  };
}
