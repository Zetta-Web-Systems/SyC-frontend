import { PAIRED_BODY_ZONES } from "@shared/constants/bodyZones";
import type { BodyLaterality, BodyZone } from "@shared/types/bodyZone.types";
import type { ZoneStatusView } from "../../../../types";

interface StatusLike {
  bodyZone: BodyZone;
  side?: BodyLaterality | null;
}

export function buildZoneStatusViews(
  affectedZones: BodyZone[] | undefined,
  statuses: StatusLike[],
): ZoneStatusView[] {
  const viewByZone = new Map<BodyZone, ZoneStatusView>();

  for (const zone of affectedZones ?? []) {
    if (viewByZone.has(zone)) continue;
    viewByZone.set(zone, {
      bodyZone: zone,
      isPaired: PAIRED_BODY_ZONES.has(zone),
      isLegacy: false,
    });
  }

  const legacyByZone = new Map<BodyZone, ZoneStatusView>();

  statuses.forEach((status, index) => {
    let view = viewByZone.get(status.bodyZone);

    if (!view) {
      view = legacyByZone.get(status.bodyZone);
      if (!view) {
        view = {
          bodyZone: status.bodyZone,
          isPaired: PAIRED_BODY_ZONES.has(status.bodyZone),
          isLegacy: true,
        };
        legacyByZone.set(status.bodyZone, view);
      }
    }

    if (view.isPaired) {
      if (status.side === "left" && view.leftStatusIndex === undefined) {
        view.leftStatusIndex = index;
      } else if (
        status.side === "right" &&
        view.rightStatusIndex === undefined
      ) {
        view.rightStatusIndex = index;
      } else if (!status.side && view.singleStatusIndex === undefined) {
        view.singleStatusIndex = index;
      }
    } else if (view.singleStatusIndex === undefined) {
      view.singleStatusIndex = index;
    }
  });

  return [...viewByZone.values(), ...legacyByZone.values()];
}
