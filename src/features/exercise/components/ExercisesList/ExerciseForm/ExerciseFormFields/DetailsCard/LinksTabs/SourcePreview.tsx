import { useState } from "react";
import { Globe, Play } from "lucide-react";
import {
  getFaviconUrl,
  getYouTubeThumbnailUrl,
} from "../../../../../../utils/linkPreview.utils";

interface SourcePreviewProps {
  url: string;
  ytId: string | null;
  domain: string | null;
}

export function SourcePreview({ url, ytId, domain }: SourcePreviewProps) {
  const [errored, setErrored] = useState(false);

  if (ytId && !errored) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-24 w-40 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900"
        aria-label="Ver video en YouTube"
      >
        <img
          src={getYouTubeThumbnailUrl(ytId)}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-error/90 text-white shadow-md">
            <Play size={16} fill="currentColor" />
          </span>
        </span>
      </a>
    );
  }

  if (domain && !errored) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-24 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white p-2 transition hover:border-primary-400"
        aria-label={`Abrir ${domain}`}
      >
        <img
          src={getFaviconUrl(domain)}
          alt=""
          className="h-8 w-8"
          onError={() => setErrored(true)}
        />
        <span className="truncate text-xs text-neutral-500">{domain}</span>
      </a>
    );
  }

  return (
    <div className="flex h-24 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 bg-white p-2 text-neutral-400">
      <Globe size={24} aria-hidden="true" />
      <span className="text-xs">Sin previsualización</span>
    </div>
  );
}
