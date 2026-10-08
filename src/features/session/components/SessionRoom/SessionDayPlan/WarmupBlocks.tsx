import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button, IconBox, Popover, PopoverHeader } from "@shared/ui";
import { MarkdownViewer } from "@shared/components/MarkdownViewer";
import {
  TRAINING_PLAN_OB,
  type TrainingPlanOBEntry,
} from "@features/trainingPlan";
import type { SessionPlanDay } from "../../../types";

type OBKey = TrainingPlanOBEntry["key"];

interface WarmupBlockProps {
  meta: TrainingPlanOBEntry;
  value: string;
}

function WarmupBlock({ meta, value }: WarmupBlockProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      side="bottom"
      align="start"
      className="w-80 max-w-[calc(100vw-2rem)] p-2"
      trigger={
        <Button
          variant="outline"
          intent="neutral"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="h-11 rounded-xl"
        >
          <IconBox size="xs" shape="sm" tone="subtle" intent={meta.tone}>
            <span className="block size-1.5 rounded-full bg-current" />
          </IconBox>
          {meta.label}
          <span className="hidden text-sm font-medium text-neutral-400 xl:inline">
            {meta.badge}
          </span>
          <ChevronDown
            size={14}
            aria-hidden="true"
            className="text-neutral-400"
          />
        </Button>
      }
    >
      <PopoverHeader title={`${meta.badge} · ${meta.label}`} />
      <div className="px-2 pb-1">
        <MarkdownViewer value={value} size="compact" />
      </div>
    </Popover>
  );
}

interface WarmupBlocksProps {
  plan: SessionPlanDay;
  keys: OBKey[];
  title: string;
}

export function WarmupBlocks({ plan, keys, title }: WarmupBlocksProps) {
  const entries = TRAINING_PLAN_OB.filter((meta) => keys.includes(meta.key));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-bold tracking-wider text-neutral-400 uppercase">
        {title}
      </span>
      {entries.map((meta) => (
        <WarmupBlock key={meta.key} meta={meta} value={plan[meta.key] ?? ""} />
      ))}
    </div>
  );
}

WarmupBlocks.displayName = "WarmupBlocks";
