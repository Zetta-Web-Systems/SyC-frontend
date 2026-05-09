import { ExternalLink } from "lucide-react";

interface SourceMetaProps {
  url: string;
  ytId: string | null;
  domain: string | null;
}

export function SourceMeta({ url, ytId, domain }: SourceMetaProps) {
  const sourceLabel = ytId ? "YouTube" : (domain ?? "Link externo");

  return (
    <div className="flex items-center justify-between gap-2 text-xs text-neutral-600">
      <span>
        Fuente:{" "}
        <span className="font-semibold text-neutral-800">{sourceLabel}</span>
      </span>
      {(ytId || domain) && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700 hover:underline"
        >
          Abrir
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
