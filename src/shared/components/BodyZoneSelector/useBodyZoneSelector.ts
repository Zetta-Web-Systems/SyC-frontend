import { useCallback, useMemo, useState } from "react";
import type {
  BodySide,
  ExtendedBodyPart,
  Slug,
} from "@shared/types/bodyHighlighter.types";
import type { BodyZone } from "@shared/types/bodyZone.types";

const HIGHLIGHT_COLOR = "#4b5db4";
const BODY_FILL = "#90cbc5";
const HOVER_FILL = "#438e87";

export type BodyZoneSelectorMode = "single" | "multi";

interface UseBodyZoneSelectorArgs {
  value: BodyZone[];
  onChange: (zones: BodyZone[]) => void;
  mode?: BodyZoneSelectorMode;
}

export function useBodyZoneSelector({
  value,
  onChange,
  mode = "multi",
}: UseBodyZoneSelectorArgs) {
  const [side, setSide] = useState<BodySide>("front");

  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggleZone = useCallback(
    (zone: BodyZone) => {
      if (mode === "single") {
        if (selectedSet.has(zone) && selectedSet.size === 1) {
          onChange([]);
          return;
        }
        onChange([zone]);
        return;
      }
      const next = new Set(selectedSet);
      if (next.has(zone)) next.delete(zone);
      else next.add(zone);
      onChange([...next]);
    },
    [selectedSet, onChange, mode],
  );

  const isSelected = useCallback(
    (zone: BodyZone) => selectedSet.has(zone),
    [selectedSet],
  );

  const clearAll = useCallback(() => onChange([]), [onChange]);

  const toggleSide = useCallback(
    () => setSide((prev) => (prev === "front" ? "back" : "front")),
    [],
  );

  const bodyData = useMemo<ExtendedBodyPart[]>(
    () =>
      value.map((zone) => ({
        slug: zone as Slug,
        color: HIGHLIGHT_COLOR,
      })),
    [value],
  );

  const handleBodyPartPress = useCallback(
    (part: ExtendedBodyPart) => {
      if (!part.slug || part.slug === "hair") return;
      toggleZone(part.slug as BodyZone);
    },
    [toggleZone],
  );

  return {
    side,
    setSide,
    toggleSide,
    selectedSet,
    isSelected,
    toggleZone,
    clearAll,
    bodyData,
    handleBodyPartPress,
    defaultFill: BODY_FILL,
    hoverFill: HOVER_FILL,
  };
}
