import { Avatar } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { MemberSimple } from "@features/members";
import {
  ATTENDANCE_STATE,
  MEMBER_AVATAR_BADGE,
  MEMBER_AVATAR_BADGE_TONE,
  MEMBER_AVATAR_SIZE,
  MEMBER_AVATAR_WRAPPER,
  type AttendanceState,
  type MemberAvatarSize,
} from "../../../constants";
import { ATTENDANCE_STATE_ICON } from "../../../constants/icons";

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface MemberAvatarProps {
  member: MemberSimple;
  state: AttendanceState;
  progress?: { done: number; total: number } | null;
  size?: MemberAvatarSize;
  className?: string;
}

export function MemberAvatar({
  member,
  state,
  progress,
  size = MEMBER_AVATAR_SIZE.LG,
  className,
}: MemberAvatarProps) {
  const fullName = `${member.name} ${member.lastname}`;
  const initials = (
    member.name.charAt(0) + member.lastname.charAt(0)
  ).toUpperCase();
  const Icon = ATTENDANCE_STATE_ICON[state];
  const isPresent = state === ATTENDANCE_STATE.PRESENT;
  const ratio =
    progress && progress.total > 0 ? progress.done / progress.total : 0;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        MEMBER_AVATAR_WRAPPER[size],
        className,
      )}
    >
      {state !== ATTENDANCE_STATE.ABSENT && (
        <svg
          viewBox="0 0 36 36"
          aria-hidden="true"
          className="absolute inset-0 size-full -rotate-90"
        >
          {isPresent ? (
            <>
              <circle
                cx="18"
                cy="18"
                r={RADIUS}
                fill="none"
                strokeWidth="2.5"
                className="stroke-success/20"
              />
              <circle
                cx="18"
                cy="18"
                r={RADIUS}
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - ratio)}
                className="stroke-success transition-[stroke-dashoffset] duration-500 ease-out"
              />
            </>
          ) : (
            <circle
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              strokeWidth="1.5"
              strokeDasharray="2.5 3"
              className="stroke-neutral-300"
            />
          )}
        </svg>
      )}

      <Avatar
        size={size}
        color={isPresent ? "primary" : "neutral"}
        src={member.image ?? null}
        fallback={initials}
        alt={fullName}
        className={cn(!isPresent && "opacity-60 grayscale")}
      />

      <span
        aria-hidden="true"
        className={cn(
          "absolute right-0 bottom-0 flex items-center justify-center rounded-full text-white ring-2 ring-white",
          MEMBER_AVATAR_BADGE[size],
          MEMBER_AVATAR_BADGE_TONE[state],
        )}
      >
        <Icon strokeWidth={3.5} />
      </span>
    </span>
  );
}

MemberAvatar.displayName = "MemberAvatar";
