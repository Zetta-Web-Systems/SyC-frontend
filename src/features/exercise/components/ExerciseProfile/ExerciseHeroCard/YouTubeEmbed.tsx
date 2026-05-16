import { useYouTubeOEmbedQuery } from "../../../hooks/useYouTubeOEmbedQuery";

interface YouTubeEmbedProps {
  videoId: string;
  url: string;
}

export function YouTubeEmbed({ videoId, url }: YouTubeEmbedProps) {
  const { data } = useYouTubeOEmbedQuery(url);
  const title = data?.title ?? "Video de YouTube";

  return (
    <div className="aspect-video w-full overflow-hidden bg-neutral-900">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

YouTubeEmbed.displayName = "YouTubeEmbed";
