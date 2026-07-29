import { ExternalLink, Globe } from "lucide-react";
import { getDomainFromUrl, getFaviconUrl } from "@features/exercise";

interface ExerciseQuickViewResourceCardProps {
  url: string;
}

export function ExerciseQuickViewResourceCard({
  url,
}: ExerciseQuickViewResourceCardProps) {
  const domain = getDomainFromUrl(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-sm"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
          {domain ? (
            <img
              src={getFaviconUrl(domain)}
              alt=""
              className="size-5"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <Globe size={18} aria-hidden="true" className="text-neutral-400" />
          )}
        </span>
        <span className="min-w-0 truncate text-sm font-semibold text-neutral-900">
          {domain ?? "Recurso externo"}
        </span>
      </div>

      <span className="line-clamp-2 break-all text-xs text-neutral-500">
        {url}
      </span>

      <span className="mt-auto inline-flex items-center gap-1 self-start rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600 transition group-hover:bg-primary-50 group-hover:text-primary-700">
        <ExternalLink size={12} aria-hidden="true" />
        Abrir
      </span>
    </a>
  );
}

ExerciseQuickViewResourceCard.displayName = "ExerciseQuickViewResourceCard";
