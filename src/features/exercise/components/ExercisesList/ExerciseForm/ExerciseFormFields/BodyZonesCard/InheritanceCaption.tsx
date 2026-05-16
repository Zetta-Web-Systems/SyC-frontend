import { Info, TriangleAlert } from "lucide-react";
import { cn } from "@shared/lib/cn";

interface InheritanceCaptionProps {
  inheritsFromGroup: boolean;
}

export function InheritanceCaption({
  inheritsFromGroup,
}: InheritanceCaptionProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
        inheritsFromGroup
          ? "bg-info/10 text-info"
          : "bg-warning/10 text-warning",
      )}
    >
      {inheritsFromGroup ? (
        <Info size={12} aria-hidden="true" />
      ) : (
        <TriangleAlert size={12} aria-hidden="true" />
      )}
      <span>
        {inheritsFromGroup ? "Heredadas del grupo" : "Modificadas vs grupo"}
      </span>
    </div>
  );
}
