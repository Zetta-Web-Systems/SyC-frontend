import { useState } from "react";
import { Link as LinkIcon, Play } from "lucide-react";
import { cn } from "@shared/lib/cn";
import {
  extractYouTubeId,
  getDomainFromUrl,
  getFaviconUrl,
} from "../../../../../../utils/linkPreview.utils";

interface TabButtonProps {
  index: number;
  link: string;
  active: boolean;
  onClick: () => void;
}

export function TabButton({ index, link, active, onClick }: TabButtonProps) {
  const trimmed = link.trim();
  const ytId = extractYouTubeId(trimmed);
  const domain = trimmed && !ytId ? getDomainFromUrl(trimmed) : null;
  const [iconErrored, setIconErrored] = useState(false);

  const label = ytId ? "YouTube" : domain ? domain : `Link ${index + 1}`;

  const icon = ytId ? (
    <Play
      size={12}
      fill="currentColor"
      aria-hidden="true"
      className="text-error"
    />
  ) : domain && !iconErrored ? (
    <img
      src={getFaviconUrl(domain)}
      alt=""
      className="size-3.5"
      onError={() => setIconErrored(true)}
    />
  ) : (
    <LinkIcon size={12} aria-hidden="true" />
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
      )}
      aria-pressed={active}
    >
      {icon}
      <span className="max-w-32 truncate">{label}</span>
    </button>
  );
}
