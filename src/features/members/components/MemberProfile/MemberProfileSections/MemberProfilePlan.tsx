import { ClipboardList, ArrowRight } from "lucide-react";
import { Card, Button, Badge } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";

interface TrainingPlan {
  name: string;
  since?: string;
  until?: string;
}

interface MemberProfilePlanProps {
  plans?: {
    current?: TrainingPlan;
    previous?: TrainingPlan;
  };
}

export function MemberProfilePlan({ plans }: MemberProfilePlanProps) {
  const current = plans?.current;
  const previous = plans?.previous;

  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-4 h-full">
      <div className="flex flex-col gap-3 h-full">
        <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
          Planificación de Entrenamiento
        </span>
        <div className="flex items-start gap-3 w-full">
          <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 shrink-0">
            <ClipboardList size={16} />
          </div>
          <div className="flex flex-col gap-3 flex-1 min-w-0 text-left">
            {current ? (
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900 truncate">
                      {current.name}
                    </span>
                    <Badge size="sm" intent="info">
                      Actual
                    </Badge>
                  </div>
                  {current.since && (
                    <span className="text-xs text-neutral-500">
                      Desde el {formatDate(current.since)}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  Ver detalle
                </Button>
              </div>
            ) : (
              <span className="text-sm text-neutral-400 py-1.5">
                Sin programa actual
              </span>
            )}

            {previous && (
              <div className="flex items-center gap-2 text-neutral-300">
                <div className="h-px flex-1 bg-neutral-200" />
                <ArrowRight size={12} />
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
            )}

            {previous && (
              <div className="flex items-center justify-between gap-3 opacity-70 w-full">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600 truncate">
                      {previous.name}
                    </span>
                    <Badge size="sm" intent="neutral">
                      Anterior
                    </Badge>
                  </div>
                  {previous.until && (
                    <span className="text-xs text-neutral-400">
                      Hasta el {formatDate(previous.until)}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  Ver detalle
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
