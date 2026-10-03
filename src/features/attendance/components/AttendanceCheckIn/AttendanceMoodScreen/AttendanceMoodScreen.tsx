import { useEffect, useRef, useState } from "react";
import { Check, SkipForward } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Avatar, Button, IconBox } from "@shared/ui";
import {
  MOOD_CHOICE_FEEDBACK_MS,
  MOOD_EMOJIS,
  MOOD_LABELS,
  MOOD_ORDER,
  type Mood,
} from "../../../constants";
import type { CheckInPerson } from "../../../types";
import { getInitials } from "../../../utils/checkIn.utils";

interface AttendanceMoodScreenProps {
  person: CheckInPerson;
  arrivalTime: string;
  secondsLeft: number;
  disabled?: boolean;
  onSelect: (mood: Mood) => void;
  onSkip: () => void;
}

const OPTION_OFFSET_MS = 150;
const OPTION_STAGGER_MS = 70;

export function AttendanceMoodScreen({
  person,
  arrivalTime,
  secondsLeft,
  disabled = false,
  onSelect,
  onSkip,
}: AttendanceMoodScreenProps) {
  const [chosen, setChosen] = useState<Mood | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fullName = `${person.name} ${person.lastname}`;

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleSelect = (mood: Mood) => {
    if (chosen) return;
    setChosen(mood);
    timerRef.current = setTimeout(
      () => onSelect(mood),
      MOOD_CHOICE_FEEDBACK_MS,
    );
  };

  const isLocked = disabled || chosen !== null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-10 px-14 pt-10 pb-12 motion-safe:animate-[attendance-screen-in_300ms_ease-out_both] landscape:gap-8">
      <div className="flex items-center gap-6 motion-safe:animate-[attendance-content-up_400ms_ease-out_both]">
        <Avatar
          src={person.profileImageUrl}
          alt={fullName}
          fallback={getInitials(person.name, person.lastname)}
          size="profile"
          className="h-24 w-24 text-3xl"
        />
        <div className="min-w-0">
          <p className="text-[32px] font-semibold text-neutral-900">
            {fullName}
          </p>
          <p className="mt-2 flex items-center gap-3 text-2xl text-neutral-700">
            <IconBox
              tone="solid"
              intent="success"
              shape="full"
              className="h-9 w-9"
            >
              <Check className="size-5" aria-hidden="true" />
            </IconBox>
            Llegada registrada · {arrivalTime}
          </p>
        </div>
      </div>

      <h1 className="text-[56px] leading-tight font-bold tracking-tight text-neutral-900 motion-safe:animate-[attendance-content-up_400ms_ease-out_80ms_both]">
        ¿Cómo te sentís hoy?
      </h1>

      <div className="grid grid-cols-1 gap-5 landscape:grid-cols-5">
        {MOOD_ORDER.map((mood, index) => (
          <div
            key={mood}
            className="motion-safe:animate-[attendance-card-up_400ms_ease-out_both]"
            style={{
              animationDelay: `${OPTION_OFFSET_MS + index * OPTION_STAGGER_MS}ms`,
            }}
          >
            <Button
              variant="outline"
              intent="neutral"
              disabled={isLocked}
              aria-pressed={chosen === mood}
              onClick={() => handleSelect(mood)}
              className={cn(
                "h-26 w-full justify-start gap-6 border-2 bg-white px-8 text-[32px] text-neutral-900 shadow-sm transition-all duration-200 active:border-primary-500 active:bg-primary-50 disabled:cursor-default landscape:h-56 landscape:flex-col landscape:justify-center landscape:gap-5 landscape:px-4 landscape:text-[28px]",
                chosen === mood &&
                  "scale-104 border-success bg-success/10 ring-4 ring-success/30 disabled:opacity-100",
                chosen !== null && chosen !== mood && "disabled:opacity-40",
              )}
            >
              <span
                aria-hidden="true"
                className="text-[56px] leading-none landscape:text-[80px]"
              >
                {MOOD_EMOJIS[mood]}
              </span>
              {MOOD_LABELS[mood]}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-8 motion-safe:animate-[attendance-content-up_400ms_ease-out_450ms_both]">
        <Button
          variant="outline"
          intent="neutral"
          className="h-20 gap-3 border-2 bg-white px-10 text-[28px] text-neutral-700"
          disabled={isLocked}
          onClick={onSkip}
        >
          <SkipForward className="size-8" aria-hidden="true" />
          Saltar
        </Button>
        <p className="text-2xl text-neutral-600">
          Si no elegís, seguimos solos en {secondsLeft} s.
        </p>
      </div>
    </div>
  );
}

AttendanceMoodScreen.displayName = "AttendanceMoodScreen";
