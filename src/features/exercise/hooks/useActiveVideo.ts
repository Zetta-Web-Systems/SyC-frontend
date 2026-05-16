import { useMemo, useState } from "react";
import { extractYouTubeId } from "../utils/linkPreview.utils";

export interface ActiveVideoEntry {
  url: string;
  videoId: string;
}

export interface ActiveVideoState {
  videos: ActiveVideoEntry[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  activeVideo: ActiveVideoEntry | null;
}

export function useActiveVideo(
  links: string[] | null | undefined,
): ActiveVideoState {
  const videos = useMemo<ActiveVideoEntry[]>(() => {
    return (links ?? [])
      .map((url) => ({ url: url.trim(), videoId: extractYouTubeId(url) }))
      .filter(
        (v): v is ActiveVideoEntry => v.url.length > 0 && v.videoId !== null,
      );
  }, [links]);

  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex =
    videos.length > 0 ? Math.min(activeIndex, videos.length - 1) : 0;
  const activeVideo = videos.length > 0 ? videos[safeIndex] : null;

  return {
    videos,
    activeIndex: safeIndex,
    setActiveIndex,
    activeVideo,
  };
}
