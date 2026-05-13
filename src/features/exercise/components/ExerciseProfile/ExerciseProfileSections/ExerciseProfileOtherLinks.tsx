import { ExternalLink, Globe } from "lucide-react";
import { Card } from "@shared/ui";
import {
  extractYouTubeId,
  getDomainFromUrl,
  getFaviconUrl,
} from "../../../utils/linkPreview.utils";
import type { Exercise } from "../../../types";

interface ExerciseProfileOtherLinksProps {
  exercise: Exercise;
}

export function ExerciseProfileOtherLinks({
  exercise,
}: ExerciseProfileOtherLinksProps) {
  const links = (exercise.links ?? []).filter(
    (url) => url.trim().length > 0 && extractYouTubeId(url) === null,
  );

  if (links.length === 0) return null;

  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-3">
        <h6 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Otros recursos
        </h6>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {links.map((url) => (
            <li key={url}>
              <ResourceCard url={url} />
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

interface ResourceCardProps {
  url: string;
}

function ResourceCard({ url }: ResourceCardProps) {
  const domain = getDomainFromUrl(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-sm"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
          {domain ? (
            <img
              src={getFaviconUrl(domain)}
              alt=""
              className="h-5 w-5"
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

ExerciseProfileOtherLinks.displayName = "ExerciseProfileOtherLinks";
