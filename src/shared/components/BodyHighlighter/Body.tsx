import { memo, useMemo, useState } from "react";
import { SVGWrapper } from "./SVGWrapper/SVGWrapper";
import { bodyFront, bodyBack } from "@shared/data/";
import { BODY_HIGHLIGHTER_DEFAULTS } from "@shared/constants/bodyHighlighter.constants";
import type {
  BodyPart,
  BodySide,
  ExtendedBodyPart,
  PathSide,
  Slug,
} from "@shared/types/bodyHighlighter.types";

export interface BodyProps {
  data: ReadonlyArray<ExtendedBodyPart>;
  side?: BodySide;
  scale?: number;
  colors?: ReadonlyArray<string>;
  onBodyPartPress?: (part: ExtendedBodyPart, side?: PathSide) => void;
  border?: string | "none";
  disabledParts?: Slug[];
  hiddenParts?: Slug[];
  defaultFill?: string;
  defaultStroke?: string;
  defaultStrokeWidth?: number;
  hoverFill?: string;
}

function resolveFill(
  ext: ExtendedBodyPart | undefined,
  colors: ReadonlyArray<string>,
  defaultFill: string,
): string {
  if (!ext) return defaultFill;
  if (ext.styles?.fill) return ext.styles.fill;
  if (ext.color) return ext.color;
  if (typeof ext.intensity === "number") {
    return colors[ext.intensity - 1] ?? defaultFill;
  }
  return defaultFill;
}

function BodyComponent({
  data,
  side = "front",
  scale = 1,
  colors = BODY_HIGHLIGHTER_DEFAULTS.COLORS,
  onBodyPartPress,
  border = BODY_HIGHLIGHTER_DEFAULTS.BORDER,
  disabledParts = [],
  hiddenParts = [],
  defaultFill = BODY_HIGHLIGHTER_DEFAULTS.FILL,
  defaultStroke = BODY_HIGHLIGHTER_DEFAULTS.STROKE,
  defaultStrokeWidth = 0,
  hoverFill = BODY_HIGHLIGHTER_DEFAULTS.HOVER,
}: BodyProps) {
  const parts = side === "front" ? bodyFront : bodyBack;
  const [hoveredSlug, setHoveredSlug] = useState<Slug | null>(null);

  const dataBySlug = useMemo(() => {
    const map = new Map<Slug, ExtendedBodyPart>();
    for (const d of data) {
      if (d.slug) map.set(d.slug, d);
    }
    return map;
  }, [data]);

  return (
    <SVGWrapper scale={scale} side={side} border={border}>
      {parts.flatMap((part: BodyPart) => {
        if (hiddenParts.includes(part.slug)) return [];

        const ext = dataBySlug.get(part.slug);
        const isDisabled = disabledParts.includes(part.slug);
        const isInteractive = !isDisabled && !!onBodyPartPress;

        const sides: PathSide[] = [];
        if (part.path.left?.length) sides.push("left");
        if (part.path.right?.length) sides.push("right");
        if (part.path.common?.length) sides.push("common");

        const isHovered = isInteractive && hoveredSlug === part.slug;
        const isSelected = !!ext && !isDisabled;

        return sides.map((pathSide) => {
          const paths = part.path[pathSide] ?? [];
          const extSideMatches =
            pathSide === "common" || !ext?.side || ext.side === pathSide;
          const baseFill =
            isDisabled || !extSideMatches
              ? defaultFill
              : resolveFill(ext, colors, defaultFill);
          const fill = isHovered && !isSelected ? hoverFill : baseFill;
          const stroke = ext?.styles?.stroke ?? defaultStroke;
          const strokeWidth = ext?.styles?.strokeWidth ?? defaultStrokeWidth;

          const handleClick = isInteractive
            ? () => onBodyPartPress?.(ext ?? { slug: part.slug }, pathSide)
            : undefined;
          const handleMouseEnter = isInteractive
            ? () => setHoveredSlug(part.slug)
            : undefined;
          const handleMouseLeave = isInteractive
            ? () => setHoveredSlug((prev) => (prev === part.slug ? null : prev))
            : undefined;

          return (
            <g key={`${part.slug}-${pathSide}`}>
              {paths.map((d, i) => (
                <path
                  key={`${part.slug}-${pathSide}-${i}`}
                  d={d}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  onClick={handleClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: isInteractive ? "pointer" : "default" }}
                  aria-label={part.slug}
                />
              ))}
            </g>
          );
        });
      })}
    </SVGWrapper>
  );
}

export const Body = memo(BodyComponent);
