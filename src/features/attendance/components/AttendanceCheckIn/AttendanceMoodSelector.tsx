import { cn } from "@shared/lib/cn";
import { MOOD, MOOD_EMOJIS, MOOD_LABELS, type Mood } from "../../constants";

interface AttendanceMoodSelectorProps {
  personName: string;
  onSelect: (mood: Mood) => void;
  disabled: boolean;
}

const MOOD_ORDER: Mood[] = [
  MOOD.MOTIVATED,
  MOOD.ENERGETIC,
  MOOD.TIRED,
  MOOD.SORE,
  MOOD.UNMOTIVATED,
];

export function AttendanceMoodSelector({
  personName,
  onSelect,
  disabled,
}: AttendanceMoodSelectorProps) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-primary-900 px-6 animate-[attendance-feedback-in_300ms_ease-out_both]">
      <div
        className="animate-[attendance-content-up_400ms_ease-out_both]"
        style={{ animationDelay: "150ms" }}
      >
        <h2 className="text-center text-3xl font-bold tracking-tight text-white md:text-5xl">
          ¿Cómo te sentís hoy, {personName}?
        </h2>
      </div>

      <div
        className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-4 animate-[attendance-card-up_450ms_ease-out_both] md:mt-14 md:grid-cols-5 md:gap-6"
        style={{ animationDelay: "350ms" }}
      >
        {MOOD_ORDER.map((mood) => (
          <button
            key={mood}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(mood)}
            className={cn(
              "flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-center font-semibold text-white backdrop-blur-sm transition",
              "hover:bg-white/20 active:scale-95",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/10 disabled:active:scale-100",
            )}
          >
            <span aria-hidden className="text-5xl leading-none md:text-6xl">
              {MOOD_EMOJIS[mood]}
            </span>
            <span className="text-base md:text-lg">{MOOD_LABELS[mood]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

AttendanceMoodSelector.displayName = "AttendanceMoodSelector";
