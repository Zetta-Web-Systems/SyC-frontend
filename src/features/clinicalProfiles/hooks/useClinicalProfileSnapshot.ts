import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { cloneProfile } from "../lib/snapshotMutations";
import type { ClinicalProfile } from "../types";

export function useClinicalProfileSnapshot(profile: ClinicalProfile | null): {
  snapshotRef: MutableRefObject<ClinicalProfile | null>;
} {
  const snapshotRef = useRef<ClinicalProfile | null>(null);

  useEffect(() => {
    if (profile && !snapshotRef.current) {
      snapshotRef.current = cloneProfile(profile);
    }
  }, [profile]);

  return { snapshotRef };
}
