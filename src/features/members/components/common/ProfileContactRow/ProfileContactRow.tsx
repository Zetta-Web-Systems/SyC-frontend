import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Label } from "@shared/ui";
import { cn } from "@shared/lib/cn";

interface ProfileContactRowProps {
  icon: LucideIcon;
  label: string;
  value?: ReactNode;
  empty?: boolean;
  iconColor?: string;
  iconBg?: string;
  badge?: ReactNode;
  className?: string;
}

export function ProfileContactRow({
  icon: Icon,
  label,
  value,
  empty = false,
  iconColor = "text-neutral-500",
  iconBg = "bg-neutral-100",
  badge,
  className,
}: ProfileContactRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 py-3",
        "border-t border-neutral-100 first:border-t-0",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          iconBg,
        )}
      >
        <Icon size={15} className={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <Label className="text-[10.5px] uppercase tracking-[0.07em] text-neutral-500">
            {label}
          </Label>
          {badge}
        </div>

        <div
          className={cn(
            "text-[13.5px] font-medium leading-[1.35] text-neutral-900",
            empty && "italic font-normal text-neutral-400",
          )}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

ProfileContactRow.displayName = "ProfileContactRow";
