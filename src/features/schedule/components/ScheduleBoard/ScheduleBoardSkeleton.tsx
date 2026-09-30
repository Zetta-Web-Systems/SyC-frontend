import { Fragment } from "react";
import { Card } from "@shared/ui";
import { SCHEDULE_DAYS, type ScheduleDay } from "../../constants";

const PLACEHOLDER_ROWS = 6;

interface ScheduleBoardSkeletonProps {
  days?: readonly ScheduleDay[];
}

/**
 * Skeleton de mi amigo Claudio
 */
export function ScheduleBoardSkeleton({
  days = SCHEDULE_DAYS,
}: ScheduleBoardSkeletonProps) {
  return (
    <div role="status" aria-label="Cargando turnero">
      <Card surface="panel" className="overflow-hidden" aria-hidden="true">
        <div className="overflow-hidden">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `112px repeat(${days.length}, minmax(168px, 1fr))`,
              minWidth: `${112 + days.length * 168}px`,
            }}
          >
            <div className="h-11 bg-primary-500" />
            {days.map((day) => (
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

                {days.map((day) => (
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
