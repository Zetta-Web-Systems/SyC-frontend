import { Link as LinkIcon, Trash2 } from "lucide-react";
import { Button, Input } from "@shared/ui";
import {
  extractYouTubeId,
  getDomainFromUrl,
} from "../../../../../../utils/linkPreview.utils";
import { SourceMeta } from "./SourceMeta";
import { SourcePreview } from "./SourcePreview";

interface ActiveLinkPanelProps {
  url: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

// TODO: Permitir reproducir el video con modal o iframe embebido sin abandonar el form (pucha)
// TODO: Obtener título / canal del video vía oEmbed para mostrar mejor info del source.
export function ActiveLinkPanel({ url, onChange, onRemove }: ActiveLinkPanelProps) {
  const trimmed = url.trim();
  const ytId = extractYouTubeId(trimmed);
  const domain = trimmed && !ytId ? getDomainFromUrl(trimmed) : null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <SourcePreview url={trimmed} ytId={ytId} domain={domain} />

        <div className="flex flex-1 flex-col gap-2">
          {trimmed && <SourceMeta url={trimmed} ytId={ytId} domain={domain} />}

          <Input
            type="url"
            value={url}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            leftElement={<LinkIcon size={16} aria-hidden="true" />}
          />

          <div className="flex justify-end">
            <Button
              intent="danger"
              variant="ghost"
              size="sm"
              onClick={onRemove}
            >
              <Trash2 size={14} aria-hidden="true" />
              Quitar este link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
