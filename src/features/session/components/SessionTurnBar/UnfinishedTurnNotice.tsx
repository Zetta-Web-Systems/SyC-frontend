import { Stamp } from "lucide-react";
import { Button } from "@shared/ui";
import { formatSlotRange } from "@features/schedule";
import type { SessionTurn } from "../../types";

interface UnfinishedTurnNoticeProps {
  turn: SessionTurn;
  onFinish: () => void;
}

export function UnfinishedTurnNotice({
  turn,
  onFinish,
}: UnfinishedTurnNoticeProps) {
  return (
    <div
      role="status"
      className="flex shrink-0 items-center gap-3 rounded-xl border-[1.5px] border-dashed border-warning bg-white py-1 pr-1 pl-4"
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-warning"
      />
      <p className="min-w-0 flex-1 text-sm text-neutral-700">
        El turno de{" "}
        <span className="font-semibold tabular-nums text-neutral-900">
          {formatSlotRange(turn.startTime, turn.endTime)}
        </span>{" "}
        terminó sin finalizar.
      </p>
      <Button
        variant="ghost"
        intent="primary"
        onClick={onFinish}
        className="h-11 shrink-0 rounded-lg"
      >
        <Stamp size={16} aria-hidden="true" />
        Finalizar sesión
      </Button>
    </div>
  );
}

UnfinishedTurnNotice.displayName = "UnfinishedTurnNotice";
