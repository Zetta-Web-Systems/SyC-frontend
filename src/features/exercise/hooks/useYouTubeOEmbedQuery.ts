import { useQuery } from "@tanstack/react-query";

export interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  html: string;
  provider_name: string;
}

export function useYouTubeOEmbedQuery(videoUrl: string | null | undefined) {
  return useQuery({
    queryKey: ["youtube", "oembed", videoUrl],
    queryFn: async (): Promise<YouTubeOEmbedResponse> => {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl as string)}&format=json`,
      );
      if (!res.ok) throw new Error(`oEmbed ${res.status}`);
      return res.json();
    },
    enabled: !!videoUrl,
    staleTime: Infinity,
    retry: 0,
  });
}
