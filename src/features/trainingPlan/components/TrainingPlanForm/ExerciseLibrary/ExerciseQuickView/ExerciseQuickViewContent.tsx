import { Accordion, AccordionItem } from "@shared/ui";
import { MarkdownViewer } from "@shared/components/MarkdownViewer";
import type { DisclosureState } from "@shared/hooks/useDisclosure";
import {
  ExerciseProfileBodyCard,
  VideoThumbnailStrip,
  YouTubeEmbed,
  extractYouTubeId,
} from "@features/exercise";
import type { ActiveVideoState, Exercise } from "@features/exercise";
import { ExerciseQuickViewResourceCard } from "./ExerciseQuickViewResourceCard";

interface ExerciseQuickViewContentProps {
  exercise: Exercise;
  videoSelection: ActiveVideoState;
  bodyDetailModal: DisclosureState;
}

export function ExerciseQuickViewContent({
  exercise,
  videoSelection,
  bodyDetailModal,
}: ExerciseQuickViewContentProps) {
  const { videos, activeIndex, setActiveIndex, activeVideo } = videoSelection;

  const hasDescription = Boolean(exercise.technicalDescription?.trim());
  const hasNotes = Boolean(exercise.notes?.trim());
  const otherLinks = (exercise.links ?? []).filter(
    (url) => url.trim().length > 0 && extractYouTubeId(url) === null,
  );
  const hasOtherLinks = otherLinks.length > 0;
  const hasAccordionContent = hasDescription || hasNotes || hasOtherLinks;

  return (
    <div className="flex flex-col gap-4">
      {activeVideo && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
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

      <ExerciseProfileBodyCard
        exercise={exercise}
        bodyDetailModal={bodyDetailModal}
      />

      {hasAccordionContent && (
        <Accordion variant="bordered">
          {hasDescription && (
            <AccordionItem
              title={
                <span className="text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                  Descripción técnica
                </span>
              }
              defaultOpen={false}
              variant="bordered"
            >
              <MarkdownViewer
                value={exercise.technicalDescription as string}
                size="compact"
              />
            </AccordionItem>
          )}

          {hasNotes && (
            <AccordionItem
              title={
                <span className="text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                  Notas
                </span>
              }
              defaultOpen={false}
              variant="bordered"
            >
              <p className="text-sm whitespace-pre-line text-neutral-900">
                {exercise.notes}
              </p>
            </AccordionItem>
          )}

          {hasOtherLinks && (
            <AccordionItem
              title={
                <span className="text-xs font-semibold tracking-wider text-neutral-600 uppercase">
                  Otros recursos
                </span>
              }
              defaultOpen={false}
              variant="bordered"
            >
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {otherLinks.map((url) => (
                  <li key={url}>
                    <ExerciseQuickViewResourceCard url={url} />
                  </li>
                ))}
              </ul>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  );
}

ExerciseQuickViewContent.displayName = "ExerciseQuickViewContent";
