import { cn } from "@shared/lib/cn";
import { AccordionItem, Badge } from "@shared/ui";
import type { MemberRiskFlagLike } from "../../../types";
import { PainLevelBar } from "./PainLevelBar";

interface RiskFlagItemProps {
  flag: MemberRiskFlagLike & { name: string };
}

export function RiskFlagItem({ flag }: RiskFlagItemProps) {
  const maxPain = flag.currentStatus.reduce(
    (max, cs) => (cs.painLevel > max ? cs.painLevel : max),
    0,
  );
  const showBar = flag.isActive && maxPain > 0;
  const showNotes = flag.isActive && Boolean(flag.notes);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border px-3 py-2.5",
        flag.isActive
          ? "border-error/15 bg-error/5"
          : "border-neutral-200 bg-neutral-50",
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className={cn(
            "flex-1 text-xs font-medium",
            flag.isActive ? "text-neutral-800" : "text-neutral-500",
          )}
        >
          {flag.name}
        </span>
        <Badge intent={flag.isActive ? "error" : "neutral"} size="sm">
          {flag.isActive ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      {showBar && <PainLevelBar level={maxPain} />}

      {showNotes && (
        <AccordionItem
          defaultOpen={false}
          title={
            <span className="text-[11px] font-medium text-neutral-500">
              Ver notas
            </span>
          }
          className="bg-transparent"
        >
          <p className="text-xs whitespace-pre-wrap text-neutral-700">
            {flag.notes}
          </p>
        </AccordionItem>
      )}
    </div>
  );
}

RiskFlagItem.displayName = "RiskFlagItem";
