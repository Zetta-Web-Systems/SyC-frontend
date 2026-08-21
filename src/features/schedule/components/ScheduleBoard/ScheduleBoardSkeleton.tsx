import { Fragment } from "react";
import { Card } from "@shared/ui";
import { SCHEDULE_DAYS } from "../../constants";

const PLACEHOLDER_ROWS = 6;

/**
 * Skeleton de mi amigo Claudio
 */
export function ScheduleBoardSkeleton() {
  return (
    <div role="status" aria-label="Cargando turnero">
      <Card surface="panel" className="overflow-hidden" aria-hidden="true">
        <div className="overflow-hidden">
          <div className="grid min-w-238 grid-cols-[112px_repeat(5,minmax(168px,1fr))]">
            <div className="h-11 bg-primary-500" />
            {SCHEDULE_DAYS.map((day) => (
              <div
                key={day}
                className="h-11 border-l border-primary-400 bg-primary-500"
              />
            ))}

            {Array.from({ length: PLACEHOLDER_ROWS }, (_, row) => (
              <Fragment key={row}>
                <div className="flex items-center justify-center border-t border-neutral-100 px-3 py-2">
                  <div className="h-3 w-14 animate-pulse rounded-full bg-neutral-200" />
                </div>

                {SCHEDULE_DAYS.map((day) => (
                  <div
                    key={day}
                    className="border-t border-l border-neutral-100 p-1.5"
                  >
                    <div className="min-h-16 animate-pulse rounded-xl bg-neutral-100" />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

ScheduleBoardSkeleton.displayName = "ScheduleBoardSkeleton";
