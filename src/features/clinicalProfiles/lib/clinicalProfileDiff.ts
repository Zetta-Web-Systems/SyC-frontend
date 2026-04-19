import type {
  ClinicalProfileFormSchema,
  ClinicalProfileRegisterSchema,
  ClinicalProfileUpdateSchema,
  CurrentStatusCreateSchema,
  CurrentStatusFormSchema,
  CurrentStatusUpdateSchema,
  MemberRiskFlagFormSchema,
  MemberRiskFlagRegisterSchema,
  MemberRiskFlagUpdateSchema,
} from "../schemas/clinicalProfile.schema";
import type { ClinicalProfile, CurrentStatus, MemberRiskFlag } from "../types";

export type ClinicalProfileOp =
  | {
      kind: "updateProfile";
      clinicalProfileId: string;
      dto: ClinicalProfileUpdateSchema;
    }
  | {
      kind: "updateFlagNotes";
      memberRiskFlagId: string;
      dto: MemberRiskFlagUpdateSchema;
    }
  | {
      kind: "deleteFlag";
      memberRiskFlagId: string;
    }
  | {
      kind: "restoreFlag";
      memberRiskFlagId: string;
    }
  | {
      kind: "updateStatus";
      currentStatusId: string;
      dto: CurrentStatusUpdateSchema;
    }
  | {
      kind: "addStatus";
      memberRiskFlagId: string;
      dto: CurrentStatusCreateSchema;
      flagIndex: number;
      statusIndex: number;
    }
  | {
      kind: "addFlag";
      dto: MemberRiskFlagRegisterSchema;
      flagIndex: number;
    };

function normalizeTrimmedText(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function flagStatusDiff(
  initial: CurrentStatus,
  next: CurrentStatusFormSchema,
): CurrentStatusUpdateSchema | null {
  const dto: CurrentStatusUpdateSchema = {};
  if (next.painLevel !== initial.painLevel) {
    dto.painLevel = next.painLevel;
  }
  const nextPhase = normalizeTrimmedText(next.movementPhase);
  const initialPhase = normalizeTrimmedText(initial.movementPhase);
  if (nextPhase !== initialPhase) {
    dto.movementPhase = nextPhase ?? "";
  }
  return Object.keys(dto).length === 0 ? null : dto;
}

function toFlagRegisterDto(
  flag: MemberRiskFlagFormSchema,
): MemberRiskFlagRegisterSchema {
  return {
    riskFlagId: flag.riskFlagId,
    notes: flag.notes && flag.notes.trim() !== "" ? flag.notes : undefined,
    currentStatus: flag.currentStatus.map((cs) => ({
      painLevel: cs.painLevel,
      movementPhase:
        cs.movementPhase && cs.movementPhase.trim() !== ""
          ? cs.movementPhase
          : undefined,
      bodyZone: cs.bodyZone,
      side: cs.side,
    })),
  };
}

function toStatusCreateDto(
  status: CurrentStatusFormSchema,
): CurrentStatusCreateSchema {
  return {
    painLevel: status.painLevel,
    movementPhase:
      status.movementPhase && status.movementPhase.trim() !== ""
        ? status.movementPhase
        : undefined,
    bodyZone: status.bodyZone,
    side: status.side,
  };
}

export function buildClinicalProfileOps(
  initial: ClinicalProfile,
  next: ClinicalProfileFormSchema,
): ClinicalProfileOp[] {
  const ops: ClinicalProfileOp[] = [];

  const initialObs =
    initial.generalObservations == null || initial.generalObservations === ""
      ? null
      : initial.generalObservations;
  const nextObs =
    next.generalObservations == null || next.generalObservations === ""
      ? null
      : next.generalObservations;
  if (initialObs !== nextObs) {
    ops.push({
      kind: "updateProfile",
      clinicalProfileId: initial.id,
      dto: { generalObservations: nextObs ?? "" },
    });
  }

  const initialFlagsById = new Map<string, MemberRiskFlag>(
    initial.memberRiskFlags.map((mrf) => [mrf.id, mrf]),
  );

  next.memberRiskFlags.forEach((nextFlag, flagIndex) => {
    if (!nextFlag.id) {
      ops.push({
        kind: "addFlag",
        dto: toFlagRegisterDto(nextFlag),
        flagIndex,
      });
      return;
    }

    const initialFlag = initialFlagsById.get(nextFlag.id);
    if (!initialFlag) return;

    if (initialFlag.isActive && !nextFlag.isActive) {
      ops.push({ kind: "deleteFlag", memberRiskFlagId: nextFlag.id });
      return;
    }

    if (!initialFlag.isActive && nextFlag.isActive) {
      ops.push({ kind: "restoreFlag", memberRiskFlagId: nextFlag.id });
    }

    const initialNotes = normalizeTrimmedText(initialFlag.notes);
    const nextNotes = normalizeTrimmedText(nextFlag.notes);
    if (initialNotes !== nextNotes) {
      ops.push({
        kind: "updateFlagNotes",
        memberRiskFlagId: nextFlag.id,
        dto: { notes: nextNotes ?? "" },
      });
    }

    const initialStatusById = new Map<string, CurrentStatus>(
      initialFlag.currentStatus.map((cs) => [cs.id, cs]),
    );

    nextFlag.currentStatus.forEach((nextStatus, statusIndex) => {
      if (!nextStatus.id) {
        ops.push({
          kind: "addStatus",
          memberRiskFlagId: nextFlag.id as string,
          dto: toStatusCreateDto(nextStatus),
          flagIndex,
          statusIndex,
        });
        return;
      }

      const initialStatus = initialStatusById.get(nextStatus.id);
      if (!initialStatus) return;

      const dto = flagStatusDiff(initialStatus, nextStatus);
      if (dto) {
        ops.push({
          kind: "updateStatus",
          currentStatusId: nextStatus.id,
          dto,
        });
      }
    });
  });

  return ops;
}

export function toClinicalProfileRegisterPayload(
  form: ClinicalProfileFormSchema,
): ClinicalProfileRegisterSchema {
  return {
    generalObservations:
      form.generalObservations && form.generalObservations.trim() !== ""
        ? form.generalObservations
        : undefined,
    memberRiskFlags: form.memberRiskFlags.map((mrf) => toFlagRegisterDto(mrf)),
  };
}
