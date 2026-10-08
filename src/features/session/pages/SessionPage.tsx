import { useEffect, useState, type ReactElement } from "react";
import { CalendarOff } from "lucide-react";
import { Button } from "@shared/ui";
import { ListState } from "@shared/components/ListState";
import { cn } from "@shared/lib/cn";
import { confirm } from "@shared/stores/confirm.store";
import { formatSlotRange } from "@features/schedule";
import {
  SESSION_BACKEND_READY,
  SESSION_EMPTY_MESSAGE,
  SESSION_POSITION,
  SESSION_POSITION_ORDER,
  SESSION_SEARCH_ORDER,
  SESSION_VIEW,
  type SessionPosition,
  type SessionView,
} from "../constants";
import { useSessionBoards } from "../hooks/queries/useSessionBoards";
import { useSessionMembersProgress } from "../hooks/queries/useSessionMembersProgress";
import { useRefreshSession } from "../hooks/queries/useRefreshSession";
import { useRegisterPresenceMutation } from "../hooks/mutations/useRegisterPresenceMutation";
import { useScreenWakeLock } from "../hooks/ui/useScreenWakeLock";
import { warnBackendTodo } from "../lib/sessionBackendTodo";
import { isNotFoundError } from "../lib/sessionErrors";
import { getPlanDestination } from "../lib/sessionMemberPlan";
import { pickDefaultMember } from "../lib/sessionSummary";
import { useSessionViewStore } from "../stores/sessionView.store";
import type {
  PlanDayPosition,
  SessionMember,
  SessionSearch,
  SessionSearchGroup,
} from "../types";
import { SessionTurnBar } from "../components/SessionTurnBar/SessionTurnBar";
import { FinishSessionModal } from "../components/SessionTurnBar/FinishSessionModal";
import { UnfinishedTurnNotice } from "../components/SessionTurnBar/UnfinishedTurnNotice";
import { SessionBoard } from "../components/SessionBoard/SessionBoard";
import { SessionBoardSkeleton } from "../components/SessionBoard/SessionBoardSkeleton";
import { SessionRoom } from "../components/SessionRoom/SessionRoom";
import { AbsenceModal, SessionEmptyState } from "../components/common";

const FIRST_DAY: PlanDayPosition = { week: 1, day: 1 };

function getDestination(sessionMember: SessionMember): PlanDayPosition {
  return getPlanDestination(sessionMember.plan) ?? FIRST_DAY;
}

function toAt(position: SessionPosition): SessionSearch["at"] {
  return position === SESSION_POSITION.CURRENT ? undefined : position;
}

interface SessionPageProps {
  search: SessionSearch;
  onSearchChange: (search: SessionSearch) => void;
}

export default function SessionPage({
  search,
  onSearchChange,
}: SessionPageProps): ReactElement {
  const position: SessionPosition = search.at ?? SESSION_POSITION.CURRENT;
  const storedView = useSessionViewStore((s) => s.view);
  const storeView = useSessionViewStore((s) => s.setView);
  const view: SessionView = search.view ?? storedView ?? SESSION_VIEW.BOARD;
  const inRoom = view === SESSION_VIEW.ROOM;

  const { boards, queries } = useSessionBoards(position);
  const refreshSession = useRefreshSession(position);
  const board = boards[position];
  const boardQuery = queries[position];
  const progress = useSessionMembersProgress(board?.members ?? []);
  const presenceMutation = useRegisterPresenceMutation();
  useScreenWakeLock();

  const [absenceMemberId, setAbsenceMemberId] = useState<string | null>(null);
  const [finishPosition, setFinishPosition] = useState<SessionPosition | null>(
    null,
  );

  const selected = board
    ? (board.members.find((m) => m.member.id === search.member) ??
      pickDefaultMember(board.members))
    : undefined;
  const roomPosition: PlanDayPosition =
    selected &&
    selected.member.id === search.member &&
    search.week &&
    search.day
      ? { week: search.week, day: search.day }
      : selected
        ? getDestination(selected)
        : FIRST_DAY;

  const absenceTarget =
    board?.members.find((m) => m.member.id === absenceMemberId) ?? null;
  const finishTarget = finishPosition ? boards[finishPosition] : undefined;
  const index = SESSION_POSITION_ORDER.indexOf(position);
  const prevTurn =
    index > 0
      ? (boards[SESSION_POSITION_ORDER[index - 1]]?.turn ?? null)
      : null;
  const nextTurn =
    index < SESSION_POSITION_ORDER.length - 1
      ? (boards[SESSION_POSITION_ORDER[index + 1]]?.turn ?? null)
      : null;

  const searchGroups: SessionSearchGroup[] = SESSION_SEARCH_ORDER.flatMap(
    (searchPosition) => {
      const searchBoard = boards[searchPosition];
      return searchBoard
        ? [
            {
              position: searchPosition,
              turn: searchBoard.turn,
              members: searchBoard.members,
            },
          ]
        : [];
    },
  );

  const unfinishedPrev = boards.prev;
  const showUnfinishedNotice =
    position === SESSION_POSITION.CURRENT &&
    Boolean(unfinishedPrev && !unfinishedPrev.finish);

  useEffect(() => {
    if (showUnfinishedNotice && !SESSION_BACKEND_READY.boardFinishInfo) {
      warnBackendTodo(
        "2A",
        "GET /session/list/members no dice si el turno ya se finalizó: el aviso del turno anterior solo conoce lo finalizado en esta tablet.",
        true,
      );
    }
  }, [showUnfinishedNotice]);

  function openInRoom(
    sessionMember: SessionMember | undefined,
    at: SessionSearch["at"] = search.at,
  ) {
    storeView(SESSION_VIEW.ROOM);
    onSearchChange({
      at,
      view: SESSION_VIEW.ROOM,
      member: sessionMember?.member.id,
      ...(sessionMember ? getDestination(sessionMember) : {}),
    });
  }

  function changeView(next: SessionView) {
    if (next === SESSION_VIEW.ROOM) {
      openInRoom(selected);
      return;
    }
    storeView(SESSION_VIEW.BOARD);
    onSearchChange({ at: search.at, view: SESSION_VIEW.BOARD });
  }

  function changeTurn(next: SessionPosition) {
    onSearchChange({ ...search, at: toAt(next) });
  }

  function changePlanPosition(next: Partial<PlanDayPosition>) {
    onSearchChange({
      at: search.at,
      view: SESSION_VIEW.ROOM,
      member: selected?.member.id,
      week: next.week ?? roomPosition.week,
      day: next.day ?? roomPosition.day,
    });
  }

  function markPresent({ member }: SessionMember) {
    if (!board) return;
    confirm({
      intent: "success",
      title: "Marcar presente",
      description: `Se registra la asistencia de ${member.name} ${member.lastname} en el turno de ${formatSlotRange(board.turn.startTime, board.turn.endTime)}.`,
      confirmLabel: "Marcar presente",
      onConfirm: async () => {
        await presenceMutation.mutateAsync({
          memberId: member.id,
          timeSlotId: board.turn.timeSlotId,
        });
      },
    });
  }

  if (boardQuery.isPending) return <SessionBoardSkeleton />;

  if (!board) {
    const isEmpty = isNotFoundError(boardQuery.error) || boardQuery.isSuccess;
    if (!isEmpty) {
      return (
        <ListState
          kind="error"
          variant="dashed-card"
          size="lg"
          message="No se pudo cargar el turno"
          description="Probá de nuevo en unos segundos."
        />
      );
    }

    const fallback =
      position === SESSION_POSITION.CURRENT ? boards.prev : boards.current;
    return (
      <SessionEmptyState
        icon={<CalendarOff size={22} aria-hidden="true" />}
        message={SESSION_EMPTY_MESSAGE[position]}
        action={
          fallback && (
            <Button
              variant="outline"
              intent="neutral"
              onClick={() =>
                changeTurn(
                  position === SESSION_POSITION.CURRENT
                    ? SESSION_POSITION.PREV
                    : SESSION_POSITION.CURRENT,
                )
              }
            >
              {position === SESSION_POSITION.CURRENT
                ? "Ver el último turno"
                : "Volver al turno en curso"}
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", inRoom && "h-full")}>
      <div
        className={cn(
          "z-20 shrink-0",
          !inRoom &&
            "md:sticky md:-top-16 md:-mx-10 md:-mt-10 md:bg-neutral-100 md:px-10 md:pt-10 md:pb-3",
        )}
      >
        <SessionTurnBar
          turn={board.turn}
          memberCount={board.members.length}
          position={position}
          prevTurn={prevTurn}
          nextTurn={nextTurn}
          onPositionChange={changeTurn}
          view={view}
          onViewChange={changeView}
          updatedAt={boardQuery.dataUpdatedAt}
          isFetching={boardQuery.isFetching}
          isOffline={boardQuery.isError}
          onRefresh={refreshSession}
          finish={board.finish}
          onFinish={() => setFinishPosition(position)}
          searchGroups={searchGroups}
          onPickMember={(searchPosition, sessionMember) =>
            openInRoom(sessionMember, toAt(searchPosition))
          }
        />
      </div>

      {showUnfinishedNotice && unfinishedPrev && (
        <UnfinishedTurnNotice
          turn={unfinishedPrev.turn}
          onFinish={() => setFinishPosition(SESSION_POSITION.PREV)}
        />
      )}

      {inRoom ? (
        <SessionRoom
          members={board.members}
          progress={progress}
          selected={selected}
          position={roomPosition}
          onSelect={(sessionMember) => openInRoom(sessionMember)}
          onPositionChange={changePlanPosition}
          onMarkPresent={markPresent}
          onMarkAbsent={(m) => setAbsenceMemberId(m.member.id)}
        />
      ) : (
        <SessionBoard
          members={board.members}
          progress={progress}
          onOpen={(sessionMember) => openInRoom(sessionMember)}
          onMarkPresent={markPresent}
          onMarkAbsent={(m) => setAbsenceMemberId(m.member.id)}
        />
      )}

      {absenceTarget && (
        <AbsenceModal
          open
          onClose={() => setAbsenceMemberId(null)}
          sessionMember={absenceTarget}
          turn={board.turn}
        />
      )}

      {finishTarget && (
        <FinishSessionModal
          open
          onClose={() => setFinishPosition(null)}
          board={finishTarget}
        />
      )}
    </div>
  );
}
