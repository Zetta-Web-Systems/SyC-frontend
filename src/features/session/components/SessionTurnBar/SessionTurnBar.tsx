import { ChevronLeft, ChevronRight, RefreshCw, Stamp } from "lucide-react";
import { Badge, Button, IconButton, Pill } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  SCHEDULE_DAY_LABELS,
  SLOT_STATUS_INTENT,
  SLOT_TAG_TINT,
  formatSlotRange,
  formatSlotTime,
  getSlotStatus,
} from "@features/schedule";
import {
  SESSION_POSITION,
  SESSION_POSITION_ORDER,
  SESSION_POSITION_TITLE,
  SESSION_VIEW_LABELS,
  SESSION_VIEW_ORDER,
  type SessionPosition,
  type SessionView,
} from "../../constants";
import { SESSION_VIEW_ICON } from "../../constants/icons";
import { useNow } from "../../hooks/ui/useNow";
import {
  TURN_STATUS,
  formatElapsedSeconds,
  getMinutesOfDay,
  getTurnTiming,
  getTurnTimingLabel,
} from "../../lib/sessionTime";
import type {
  SessionFinish,
  SessionMember,
  SessionSearchGroup,
  SessionTurn,
} from "../../types";
import { SessionFinishStamp } from "./SessionFinishStamp";
import { SessionMemberSearch } from "./SessionMemberSearch";

const CLOCK_TICK_MS = 15_000;
const LIVE_TICK_MS = 1_000;

interface TurnStepProps {
  direction: "prev" | "next";
  turn: SessionTurn | null;
  onClick: () => void;
}

function TurnStep({ direction, turn, onClick }: TurnStepProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const label = direction === "prev" ? "Turno anterior" : "Turno siguiente";

  return (
    <Button
      variant="outline"
      intent="neutral"
      disabled={!turn}
      onClick={onClick}
      aria-label={
        turn
          ? `${label}: ${formatSlotRange(turn.startTime, turn.endTime)}`
          : label
      }
      className={cn(
        "h-12 min-w-12 rounded-xl px-2 sm:px-3",
        direction === "next" && "flex-row-reverse",
      )}
    >
      <Icon size={20} aria-hidden="true" />
      {turn && (
        <span className="hidden text-sm font-semibold tabular-nums text-neutral-500 xl:inline">
          {formatSlotTime(turn.startTime)}
        </span>
      )}
    </Button>
  );
}

interface LiveIndicatorProps {
  updatedAt: number;
  isFetching: boolean;
  isOffline: boolean;
  onRefresh: () => void;
}

function LiveIndicator({
  updatedAt,
  isFetching,
  isOffline,
  onRefresh,
}: LiveIndicatorProps) {
  const now = useNow(LIVE_TICK_MS);
  const elapsed = formatElapsedSeconds(
    Math.max(0, Math.round((now.getTime() - updatedAt) / 1000)),
  );

  return (
    <span className="inline-flex items-center gap-1">
      <span
        role="status"
        className="inline-flex items-center gap-2 text-sm text-neutral-500"
      >
        <span className="relative flex size-2.5" aria-hidden="true">
          {!isOffline && (
            <span className="absolute inline-flex size-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
          )}
          <span
            className={cn(
              "relative inline-flex size-2.5 rounded-full",
              isOffline ? "bg-error" : "bg-success",
            )}
          />
        </span>
        <span
          className={cn(
            "font-semibold",
            isOffline ? "text-error" : "text-success",
          )}
        >
          {isOffline ? "Sin conexión" : "En vivo"}
        </span>
        <span className="tabular-nums">
          ·{" "}
          {isOffline
            ? `reintentando, dato de hace ${elapsed}`
            : isFetching
              ? "actualizando…"
              : `hace ${elapsed}`}
        </span>
      </span>
      <IconButton
        size="md"
        aria-label="Actualizar"
        disabled={isFetching}
        onClick={onRefresh}
        className="size-11"
      >
        <RefreshCw
          size={16}
          aria-hidden="true"
          className={cn(isFetching && "motion-safe:animate-spin")}
        />
      </IconButton>
    </span>
  );
}

interface ViewToggleProps {
  view: SessionView;
  onChange: (view: SessionView) => void;
}

function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Vista de la sesión"
      className="inline-flex h-12 items-center gap-0.5 rounded-xl bg-neutral-200/70 p-0.5"
    >
      {SESSION_VIEW_ORDER.map((option) => {
        const Icon = SESSION_VIEW_ICON[option];
        const active = option === view;

        return (
          <Button
            key={option}
            role="radio"
            aria-checked={active}
            variant="ghost"
            intent="neutral"
            onClick={() => onChange(option)}
            className={cn(
              "h-11 rounded-lg px-4",
              active
                ? "bg-white text-neutral-900 shadow-sm hover:bg-white"
                : "text-neutral-500 hover:bg-white/60 hover:text-neutral-800",
            )}
          >
            <Icon
              size={16}
              aria-hidden="true"
              className={cn(active && "text-primary-500")}
            />
            {SESSION_VIEW_LABELS[option]}
          </Button>
        );
      })}
    </div>
  );
}

interface SessionTurnBarProps {
  turn: SessionTurn;
  memberCount: number;
  position: SessionPosition;
  prevTurn: SessionTurn | null;
  nextTurn: SessionTurn | null;
  onPositionChange: (position: SessionPosition) => void;
  view: SessionView;
  onViewChange: (view: SessionView) => void;
  updatedAt: number;
  isFetching: boolean;
  isOffline: boolean;
  onRefresh: () => void;
  finish: SessionFinish | null;
  onFinish: () => void;
  searchGroups: SessionSearchGroup[];
  onPickMember: (
    position: SessionPosition,
    sessionMember: SessionMember,
  ) => void;
}

export function SessionTurnBar({
  turn,
  memberCount,
  position,
  prevTurn,
  nextTurn,
  onPositionChange,
  view,
  onViewChange,
  updatedAt,
  isFetching,
  isOffline,
  onRefresh,
  finish,
  onFinish,
  searchGroups,
  onPickMember,
}: SessionTurnBarProps) {
  const now = useNow(CLOCK_TICK_MS);
  const timing = getTurnTiming(
    turn.startTime,
    turn.endTime,
    getMinutesOfDay(now),
  );
  const percent = Math.round(timing.progress * 100);
  const slotStatus = getSlotStatus(memberCount, turn.capacity);
  const index = SESSION_POSITION_ORDER.indexOf(position);
  const canFinish = !finish && timing.status !== TURN_STATUS.UPCOMING;

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <TurnStep
            direction="prev"
            turn={prevTurn}
            onClick={() => onPositionChange(SESSION_POSITION_ORDER[index - 1])}
          />

          <div className="min-w-0 px-1">
            <p className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
              {SCHEDULE_DAY_LABELS[turn.dayOfWeek]} ·{" "}
              {SESSION_POSITION_TITLE[position]}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight tabular-nums text-neutral-900 md:text-4xl">
                {formatSlotRange(turn.startTime, turn.endTime)}
              </h1>
              {turn.tag && (
                <Pill
                  size="xs"
                  uppercase
                  intent="neutral"
                  className={cn("shrink-0", SLOT_TAG_TINT[turn.tag])}
                >
                  {turn.tag}
                </Pill>
              )}
            </div>
          </div>

          <TurnStep
            direction="next"
            turn={nextTurn}
            onClick={() => onPositionChange(SESSION_POSITION_ORDER[index + 1])}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SessionMemberSearch groups={searchGroups} onPick={onPickMember} />
          <ViewToggle view={view} onChange={onViewChange} />
          {finish && <SessionFinishStamp finish={finish} />}
          {canFinish && (
            <Button
              intent="primary"
              onClick={onFinish}
              className="h-12 rounded-xl"
            >
              <Stamp size={18} aria-hidden="true" />
              Finalizar sesión
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex min-w-60 flex-1 items-center gap-3">
          <div
            role="progressbar"
            aria-label="Tiempo transcurrido del turno"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-700 ease-out",
                finish
                  ? "bg-success"
                  : timing.status === TURN_STATUS.FINISHED
                    ? "bg-neutral-400"
                    : "bg-primary-500",
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-neutral-600">
            {getTurnTimingLabel(timing)}
          </span>
        </div>
        <LiveIndicator
          updatedAt={updatedAt}
          isFetching={isFetching}
          isOffline={isOffline}
          onRefresh={onRefresh}
        />
        <Badge
          variant="dot"
          intent={SLOT_STATUS_INTENT[slotStatus]}
          size="md"
          className="text-neutral-700"
        >
          <span className="tabular-nums">
            {memberCount}/{turn.capacity}
          </span>
          alumnos
        </Badge>
        {position !== SESSION_POSITION.CURRENT && (
          <Button
            variant="ghost"
            intent="primary"
            onClick={() => onPositionChange(SESSION_POSITION.CURRENT)}
          >
            Volver al turno en curso
          </Button>
        )}
      </div>
    </header>
  );
}

SessionTurnBar.displayName = "SessionTurnBar";
