import { cn } from "@shared/lib/cn";
import { useYouTubeOEmbedQuery } from "../../../hooks/useYouTubeOEmbedQuery";
import { getYouTubeThumbnailUrl } from "../../../utils/linkPreview.utils";

interface VideoEntry {
  url: string;
  videoId: string;
}

interface VideoThumbnailStripProps {
  videos: VideoEntry[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function VideoThumbnailStrip({
  videos,
  activeIndex,
  onSelect,
}: VideoThumbnailStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {videos.map((video, index) => (
        <VideoThumbnailButton
          key={video.url}
          video={video}
          isActive={index === activeIndex}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}

interface VideoThumbnailButtonProps {
  video: VideoEntry;
  isActive: boolean;
  onClick: () => void;
}

function VideoThumbnailButton({
  video,
  isActive,
  onClick,
}: VideoThumbnailButtonProps) {
  const { data } = useYouTubeOEmbedQuery(video.url);
  const thumbnailUrl =
    data?.thumbnail_url ?? getYouTubeThumbnailUrl(video.videoId);
  const title = data?.title ?? "Video";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Ver ${title}`}
      className={cn(
        "group relative h-12 w-20 shrink-0 overflow-hidden rounded-md border-2 transition",
        isActive
          ? "border-primary-500 ring-2 ring-primary-200"
          : "border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100",
      )}
    >
      <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
    </button>
  );
}

VideoThumbnailStrip.displayName = "VideoThumbnailStrip";
