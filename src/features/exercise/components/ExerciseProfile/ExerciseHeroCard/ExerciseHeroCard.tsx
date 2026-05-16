import { AccordionItem, Card } from "@shared/ui";
import { MarkdownViewer } from "@shared/components/MarkdownViewer";
import type { ActiveVideoState } from "../../../hooks/useActiveVideo";
import type { Exercise } from "../../../types";
import { YouTubeEmbed } from "./YouTubeEmbed";
import { VideoThumbnailStrip } from "./VideoThumbnailStrip";

interface ExerciseHeroCardProps {
  exercise: Exercise;
  videoSelection: ActiveVideoState;
}

export function ExerciseHeroCard({
  exercise,
  videoSelection,
}: ExerciseHeroCardProps) {
  const { videos, activeIndex, setActiveIndex, activeVideo } = videoSelection;
  const hasDescription = Boolean(
    exercise.technicalDescription &&
    exercise.technicalDescription.trim().length > 0,
  );

  if (!activeVideo && !hasDescription) return null;

  return (
    <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {activeVideo && (
        <div className="flex flex-col items-center gap-3 bg-neutral-50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-lg shadow-sm">
            <YouTubeEmbed videoId={activeVideo.videoId} url={activeVideo.url} />
          </div>
          {videos.length > 1 && (
            <div className="w-full max-w-md">
              <VideoThumbnailStrip
                videos={videos}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
            </div>
          )}
        </div>
      )}

      {hasDescription && (
        <AccordionItem
          title={
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Descripción técnica
            </span>
          }
          defaultOpen
          className="rounded-none border-0 border-t border-neutral-200 bg-transparent"
        >
          <MarkdownViewer
            value={exercise.technicalDescription as string}
            size="compact"
          />
        </AccordionItem>
      )}
    </Card>
  );
}

ExerciseHeroCard.displayName = "ExerciseHeroCard";
