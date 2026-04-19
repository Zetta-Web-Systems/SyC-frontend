import { PAIN_TEXT_CLASS, type PainPhase } from "../constants";
import { getPainPhase } from "../components/ClinicalProfileForm/MemberRiskFlagsSection/common/painLevel";

export function getPainTextClass(level: number): string {
  return PAIN_TEXT_CLASS[getPainPhase(level)];
}

export function getPainTextClassByPhase(phase: PainPhase): string {
  return PAIN_TEXT_CLASS[phase];
}
