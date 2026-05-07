import { cva } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { getPainTextClass } from "../../../../lib/painLevelStyles";

const SIZE_CONFIG = {
  sm: { boxSize: 32, radius: 12, strokeWidth: 3, fontSize: "text-xs" },
  md: { boxSize: 40, radius: 15, strokeWidth: 3.5, fontSize: "text-sm" },
  lg: { boxSize: 48, radius: 18, strokeWidth: 4, fontSize: "text-base" },
} as const;

interface PainRingProps {
  level: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

const ringVariants = cva(
  "relative inline-flex items-center justify-center shrink-0",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export function PainRing({ level, max = 10, size = "md" }: PainRingProps) {
  const { boxSize, radius, strokeWidth, fontSize } = SIZE_CONFIG[size];
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(level / max, 1) * circumference;
  const colorClass = getPainTextClass(level);
  const cx = boxSize / 2;
  const cy = boxSize / 2;

  return (
    <div className={cn(ringVariants({ size }), colorClass)}>
      <svg
        className="absolute inset-0 -rotate-90 text-neutral-200"
        width={boxSize}
        height={boxSize}
        viewBox={`0 0 ${boxSize} ${boxSize}`}
        aria-hidden="true"
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          className={colorClass}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <span className={cn(fontSize, "font-bold tabular-nums", colorClass)}>
        {level}
      </span>
    </div>
  );
}
