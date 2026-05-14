import { useMemo } from "react";
import {
  PAIN_LEVEL_MAX,
  SIDE_LABELS,
  getPainTextClass,
} from "@features/clinicalProfiles";
import { ALL_BODY_ZONES, BODY_ZONE_LABELS } from "@shared/constants/bodyZones";
import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";
import type { MemberRiskFlagLike } from "../../../types";

interface ZoneDetailsListProps {
  memberRiskFlags: MemberRiskFlagLike[];
}

interface ZoneEntry {
  zone: BodyZone;
  side: BodyLaterality | null;
  flags: { id: string; name: string; painLevel: number }[];
}

export function ZoneDetailsList({ memberRiskFlags }: ZoneDetailsListProps) {
  const entries = useMemo(() => {
    const map = new Map<string, ZoneEntry>();

    for (const flag of memberRiskFlags) {
      if (!flag.isActive || !flag.name) continue;
      for (const cs of flag.currentStatus) {
        if (!cs.bodyZone) continue;
        const side = cs.side ?? null;
        const key = `${cs.bodyZone}__${side ?? ""}`;
        const existing = map.get(key);
        const flagEntry = {
          id: flag.id,
          name: flag.name,
          painLevel: cs.painLevel,
        };
        if (existing) {
          existing.flags.push(flagEntry);
        } else {
          map.set(key, { zone: cs.bodyZone, side, flags: [flagEntry] });
        }
      }
    }

    const list = [...map.values()];
    list.sort((a, b) => {
      const zoneDiff =
        ALL_BODY_ZONES.indexOf(a.zone) - ALL_BODY_ZONES.indexOf(b.zone);
      if (zoneDiff !== 0) return zoneDiff;
      return (a.side ?? "").localeCompare(b.side ?? "");
    });
    for (const entry of list) {
      entry.flags.sort((a, b) => b.painLevel - a.painLevel);
    }
    return list;
  }, [memberRiskFlags]);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2 border-t border-neutral-200 pt-5">
      <p className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
        Detalle por zona
      </p>
      <ul className="flex flex-wrap justify-center gap-1.5">
        {entries.map((entry) => (
          <li
            key={`${entry.zone}-${entry.side ?? "none"}`}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs"
          >
            <span className="font-medium text-neutral-700">
              {BODY_ZONE_LABELS[entry.zone]}
              {entry.side && (
                <span className="text-neutral-400">
                  {" · "}
                  {SIDE_LABELS[entry.side]}
                </span>
              )}
            </span>
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-500">
              {entry.flags.map((flag, idx) => (
                <span key={flag.id} className="flex items-center gap-1.5">
                  {idx > 0 && (
                    <span className="text-neutral-300" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <span>{flag.name}</span>
                  <span
                    className={`font-semibold ${getPainTextClass(flag.painLevel)}`}
                  >
                    {flag.painLevel}/{PAIN_LEVEL_MAX}
                  </span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

ZoneDetailsList.displayName = "ZoneDetailsList";
