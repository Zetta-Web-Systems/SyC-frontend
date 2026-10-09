import { useState } from "react";
import { Popover, PopoverHeader } from "@shared/ui";
import type { SessionFinish } from "../../types";

interface SessionFinishStampProps {
  finish: SessionFinish;
}

export function SessionFinishStamp({ finish }: SessionFinishStampProps) {
  const [open, setOpen] = useState(false);
  const { finishedAt, finishedBy, observations } = finish;

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      side="bottom"
      align="end"
      className="w-72"
      trigger={
        <button
          type="button"
          aria-expanded={open}
          aria-label={`Sesión finalizada a las ${finishedAt}. Ver el detalle`}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex min-h-11 cursor-pointer items-center rounded-md focus-visible:ring-2 focus-visible:ring-success focus-visible:outline-none"
        >
          <span className="inline-flex -rotate-3 items-center gap-2 rounded-md border-4 border-double border-success px-3 py-1 text-sm font-bold text-success uppercase motion-safe:animate-[session-stamp-in_320ms_ease-out]">
            <span className="tracking-widest">Finalizada</span>
            <span className="tabular-nums">{finishedAt}</span>
          </span>
        </button>
      }
    >
      <PopoverHeader title="Sesión finalizada" />
      <div className="flex flex-col gap-2 px-2 pb-2 text-sm">
        <p className="text-neutral-600">
          A las{" "}
          <span className="font-semibold text-neutral-900">{finishedAt}</span>
          {finishedBy && (
            <>
              {" "}
              por{" "}
              <span className="font-semibold text-neutral-900">
                {finishedBy}
              </span>
            </>
          )}
          .
        </p>
        {observations ? (
          <p className="rounded-lg bg-neutral-50 px-3 py-2 whitespace-pre-line text-neutral-700 italic">
            “{observations}”
          </p>
        ) : (
          <p className="text-neutral-400">Sin observaciones.</p>
        )}
      </div>
    </Popover>
  );
}

SessionFinishStamp.displayName = "SessionFinishStamp";
