import type { ClinicalProfile, CurrentStatus, MemberRiskFlag } from "../types";
import type { ClinicalProfileOp } from "./clinicalProfileDiff";

export function cloneProfile(profile: ClinicalProfile): ClinicalProfile {
  return {
    ...profile,
    memberRiskFlags: profile.memberRiskFlags.map((mrf) => ({
      ...mrf,
      riskFlag: { ...mrf.riskFlag },
      currentStatus: mrf.currentStatus.map((cs) => ({ ...cs })),
    })),
  };
}

export function snapshotFromMemberFlag(flag: MemberRiskFlag): MemberRiskFlag {
  return {
    ...flag,
    riskFlag: { ...flag.riskFlag },
    currentStatus: flag.currentStatus.map((cs) => ({ ...cs })),
  };
}

export interface CreatedOpResult {
  status?: CurrentStatus;
  flag?: MemberRiskFlag;
}

export function applyOpToSnapshot(
  op: ClinicalProfileOp,
  snapshot: ClinicalProfile,
  created?: CreatedOpResult,
): void {
  switch (op.kind) {
    case "updateProfile": {
      snapshot.generalObservations =
        op.dto.generalObservations === ""
          ? null
          : (op.dto.generalObservations ?? null);
      return;
    }
    case "updateFlagNotes": {
      const flag = snapshot.memberRiskFlags.find(
        (f) => f.id === op.memberRiskFlagId,
      );
      if (flag) {
        flag.notes = op.dto.notes === "" ? null : (op.dto.notes ?? null);
      }
      return;
    }
    case "deleteFlag": {
      const flag = snapshot.memberRiskFlags.find(
        (f) => f.id === op.memberRiskFlagId,
      );
      if (flag) flag.isActive = false;
      return;
    }
    case "restoreFlag": {
      const flag = snapshot.memberRiskFlags.find(
        (f) => f.id === op.memberRiskFlagId,
      );
      if (flag) flag.isActive = true;
      return;
    }
    case "updateStatus": {
      for (const flag of snapshot.memberRiskFlags) {
        const status = flag.currentStatus.find(
          (cs) => cs.id === op.currentStatusId,
        );
        if (status) {
          if (op.dto.painLevel !== undefined) {
            status.painLevel = op.dto.painLevel;
          }
          if (op.dto.movementPhase !== undefined) {
            status.movementPhase =
              op.dto.movementPhase === "" ? null : op.dto.movementPhase;
          }
          return;
        }
      }
      return;
    }
    case "addStatus": {
      if (!created?.status) return;
      const flag = snapshot.memberRiskFlags.find(
        (f) => f.id === op.memberRiskFlagId,
      );
      if (flag) flag.currentStatus.push({ ...created.status });
      return;
    }
    case "addFlag": {
      if (!created?.flag) return;
      snapshot.memberRiskFlags.push(snapshotFromMemberFlag(created.flag));
      return;
    }
  }
}
