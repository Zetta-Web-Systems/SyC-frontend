const MINUTES_PER_HOUR = 60;

export const TURN_STATUS = {
  UPCOMING: "upcoming",
  RUNNING: "running",
  FINISHED: "finished",
} as const;

export type TurnStatus = (typeof TURN_STATUS)[keyof typeof TURN_STATUS];

export interface TurnTiming {
  status: TurnStatus;
  minutes: number;
  progress: number;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
}

export function getMinutesOfDay(date: Date): number {
  return (
    date.getHours() * MINUTES_PER_HOUR +
    date.getMinutes() +
    date.getSeconds() / 60
  );
}

export function formatClockTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function getDateTimeClock(dateTime: string): string {
  const local = /^\d{4}-\d{2}-\d{2} (\d{2}:\d{2})/.exec(dateTime);
  if (local) return local[1];
  const date = new Date(dateTime);
  return Number.isNaN(date.getTime()) ? "" : formatClockTime(date).slice(0, 5);
}

export function getTurnTiming(
  startTime: string,
  endTime: string,
  nowMinutes: number,
): TurnTiming {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (nowMinutes < start) {
    return {
      status: TURN_STATUS.UPCOMING,
      minutes: start - nowMinutes,
      progress: 0,
    };
  }
  if (nowMinutes >= end) {
    return {
      status: TURN_STATUS.FINISHED,
      minutes: nowMinutes - end,
      progress: 1,
    };
  }
  return {
    status: TURN_STATUS.RUNNING,
    minutes: end - nowMinutes,
    progress: (nowMinutes - start) / (end - start),
  };
}

function formatMinutes(minutes: number): string {
  const rounded = Math.max(0, Math.round(minutes));
  if (rounded < MINUTES_PER_HOUR) return `${rounded} min`;
  const hours = Math.floor(rounded / MINUTES_PER_HOUR);
  const rest = rounded % MINUTES_PER_HOUR;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function getTurnTimingLabel({ status, minutes }: TurnTiming): string {
  switch (status) {
    case TURN_STATUS.UPCOMING:
      return `Empieza en ${formatMinutes(minutes)}`;
    case TURN_STATUS.RUNNING:
      return `Quedan ${formatMinutes(minutes)}`;
    case TURN_STATUS.FINISHED:
      return `Terminó hace ${formatMinutes(minutes)}`;
  }
}

export function formatElapsedSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  return `${Math.floor(seconds / 60)} min`;
}
