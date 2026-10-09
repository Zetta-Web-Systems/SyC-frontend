import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";
import { Avatar, Button } from "@shared/ui";
import type { CheckInPerson, CheckInTimer } from "../../../types";
import { getInitials } from "../../../utils/checkIn.utils";

interface AttendanceResultProps {
  person: CheckInPerson;
  greeting: string;
  status?: ReactNode;
  children?: ReactNode;
  timer: CheckInTimer | null;
  secondsLeft: number;
  onDismiss: () => void;
}

export function AttendanceResult({
  person,
  greeting,
  status,
  children,
  timer,
  secondsLeft,
  onDismiss,
}: AttendanceResultProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center gap-6 px-14 pt-2 pb-8 motion-safe:animate-[attendance-screen-in_300ms_ease-out_both]">
      <div className="flex w-full max-w-180 flex-1 flex-col items-center justify-center gap-7 landscape:max-w-205 landscape:gap-5">
        <div className="flex items-center justify-center gap-6">
          <div className="shrink-0 motion-safe:animate-[attendance-icon-bounce_500ms_ease-out_both]">
            <Avatar
              src={person.profileImageUrl}
              alt={`${person.name} ${person.lastname}`}
              fallback={getInitials(person.name, person.lastname)}
              size="profile"
              className="h-24 w-24 text-3xl"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-[52px] leading-[1.05] font-bold tracking-tight text-neutral-900 motion-safe:animate-[attendance-content-up_400ms_ease-out_80ms_both]">
              {greeting}
            </h1>
            {status && (
              <p className="mt-2 text-[28px] text-neutral-700 motion-safe:animate-[attendance-content-up_400ms_ease-out_160ms_both]">
                {status}
              </p>
            )}
          </div>
        </div>

        {children}
      </div>

      <footer className="flex flex-col items-center gap-2 motion-safe:animate-[attendance-content-up_400ms_ease-out_350ms_both]">
        <Button
          variant="solid"
          intent="primary"
          className="relative h-20 w-full max-w-105 overflow-hidden text-4xl shadow-sm"
          onClick={onDismiss}
        >
          Listo
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2 bg-primary-700"
          >
            <span
              key={timer?.endsAt}
              className={cn(
                "block h-full w-full origin-left bg-white/70",
                timer &&
                  "motion-safe:animate-[attendance-progress_linear_forwards]",
              )}
              style={
                timer ? { animationDuration: `${timer.seconds}s` } : undefined
              }
            />
          </span>
        </Button>
        {timer && (
          <p className="text-[22px] text-neutral-600">
            Esta pantalla se cierra sola en {secondsLeft} s
          </p>
        )}
      </footer>
    </div>
  );
}

AttendanceResult.displayName = "AttendanceResult";
