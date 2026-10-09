import { Card } from "@shared/ui";

const SKELETON_CARDS = 6;

export function SessionBoardSkeleton() {
  return (
    <div
      className="flex flex-col gap-5"
      aria-busy="true"
      aria-label="Cargando turno"
    >
      <div className="flex flex-col gap-3">
        <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />
        <div className="h-9 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="h-1.5 w-full animate-pulse rounded-full bg-neutral-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_CARDS }, (_, i) => (
          <Card
            key={i}
            surface="panel"
            padding="md"
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="size-12 animate-pulse rounded-full bg-neutral-200" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
              </div>
            </div>
            <div className="h-11 animate-pulse rounded-lg bg-neutral-100" />
          </Card>
        ))}
      </div>
    </div>
  );
}

SessionBoardSkeleton.displayName = "SessionBoardSkeleton";
