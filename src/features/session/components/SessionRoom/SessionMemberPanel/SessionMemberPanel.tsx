import { useState, type ReactNode } from "react";
import { CalendarOff } from "lucide-react";
import { ListState } from "@shared/components/ListState";
import { LoadingState } from "@shared/components/LoadingState/LoadingState";
import { toast } from "@shared/stores/toast.store";
import type { Exercise } from "@features/exercise";
import { ExerciseQuickView } from "@features/trainingPlan";
import { ATTENDANCE_STATE, SESSION_BACKEND_READY } from "../../../constants";
import { useSessionPlanDayQuery } from "../../../hooks/queries/useSessionPlanDayQuery";
import { useCompleteExecutionMutation } from "../../../hooks/mutations/useCompleteExecutionMutation";
import { warnBackendTodo } from "../../../lib/sessionBackendTodo";
import { getSuggestedPosition } from "../../../lib/sessionMemberPlan";
import {
  getDayProgress,
  indexPreviousExecutions,
} from "../../../lib/sessionProgress";
import { useSessionDayOverridesStore } from "../../../stores/sessionDayOverrides.store";
import type {
  PlanDayPosition,
  SessionExecution,
  SessionMember,
} from "../../../types";
import { MemberAttendanceMenu, SessionEmptyState } from "../../common";
import { SessionDayPlan } from "../SessionDayPlan/SessionDayPlan";
import { WarmupBlocks } from "../SessionDayPlan/WarmupBlocks";
import { DayWeekPicker } from "./DayWeekPicker";
import { MemberAttendancePanel } from "./MemberAttendancePanel";
import { MemberPanelHeader } from "./MemberPanelHeader";
import { SessionPlanNotice } from "./SessionPlanNotice";

interface MemberPlanViewProps {
  sessionMember: SessionMember;
  position: PlanDayPosition;
  onPositionChange: (next: Partial<PlanDayPosition>) => void;
  menu: ReactNode;
}

function MemberPlanView({
  sessionMember,
  position,
  onPositionChange,
  menu,
}: MemberPlanViewProps) {
  const { member } = sessionMember;
  const { week, day } = position;

  const planQuery = useSessionPlanDayQuery(member.id, week, day);
  const previousQuery = useSessionPlanDayQuery(
    member.id,
    week - 1,
    day,
    week > 1,
  );
  const plan = planQuery.data;
  const trainingDay = plan?.trainingDays[0];
  const completeMutation = useCompleteExecutionMutation(
    member.id,
    week,
    day,
    plan?.id,
  );
  const setDayOverride = useSessionDayOverridesStore((s) => s.setOverride);
  const [quickViewExercise, setQuickViewExercise] = useState<Exercise | null>(
    null,
  );
  const progress = plan ? getDayProgress(plan) : undefined;

  function markExecution(
    execution: SessionExecution,
    isCompleted: boolean,
    observation?: string,
  ) {
    completeMutation.mutate({
      executionId: execution.id,
      dto: { isCompleted, instructorObservations: observation },
    });

    if (!SESSION_BACKEND_READY.stableCurrentDay) {
      warnBackendTodo(
        "2B",
        "GET /session/list/members cambia currentTrainingDay apenas se marca un ejercicio. El día se fija en esta tablet hasta que el back lo resuelva.",
        true,
      );
      setDayOverride(member.id, {
        week,
        day,
        dayLabel: trainingDay?.trainingDayLabel ?? null,
      });
    }
  }

  function saveObservation(execution: SessionExecution, text: string) {
    completeMutation.mutate(
      {
        executionId: execution.id,
        dto: SESSION_BACKEND_READY.standaloneObservation
          ? { instructorObservations: text || null }
          : {
              isCompleted: execution.isCompleted,
              instructorObservations: text || null,
            },
      },
      {
        onSuccess: () =>
          toast.success(text ? "Observación guardada" : "Observación borrada"),
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <MemberPanelHeader
        sessionMember={sessionMember}
        plan={plan}
        progress={progress}
        actions={menu}
      >
        {plan && (
          <DayWeekPicker
            position={position}
            weeks={plan.durationInWeeks}
            daysPerWeek={plan.daysPerWeek}
            dayLabel={trainingDay?.trainingDayLabel}
            suggested={getSuggestedPosition(sessionMember.plan)}
            onChange={onPositionChange}
          />
        )}
      </MemberPanelHeader>

      <SessionPlanNotice
        plan={sessionMember.plan}
        position={position}
        onGoToSuggested={onPositionChange}
      />

      {planQuery.isPending ? (
        <LoadingState message="Cargando el día del plan" />
      ) : !plan || !trainingDay ? (
        <ListState
          kind="error"
          variant="dashed-card"
          size="lg"
          message="No se pudo cargar el día del plan"
        />
      ) : (
        <>
          <WarmupBlocks
            plan={plan}
            keys={["mobilityBlock", "preparatoryBlock"]}
            title="1° y 2° bloque"
          />

          <SessionDayPlan
            key={`${week}-${day}`}
            firstName={member.name}
            exercises={trainingDay.plannedExercises}
            week={week}
            previousByPlanned={indexPreviousExecutions(previousQuery.data)}
            previousLoading={week > 1 && previousQuery.isPending}
            after={
              <WarmupBlocks
                plan={plan}
                keys={["aerobicBlock"]}
                title="4° bloque"
              />
            }
            onMark={markExecution}
            onUndo={(execution) =>
              completeMutation.mutate({
                executionId: execution.id,
                dto: { isCompleted: null },
              })
            }
            onSaveObservation={saveObservation}
            onViewExercise={setQuickViewExercise}
          />
        </>
      )}

      <ExerciseQuickView
        exercise={quickViewExercise}
        onClose={() => setQuickViewExercise(null)}
      />
    </div>
  );
}

interface SessionMemberPanelProps {
  sessionMember: SessionMember;
  position: PlanDayPosition;
  onPositionChange: (next: Partial<PlanDayPosition>) => void;
  onMarkPresent: () => void;
  onMarkAbsent: () => void;
}

export function SessionMemberPanel({
  sessionMember,
  position,
  onPositionChange,
  onMarkPresent,
  onMarkAbsent,
}: SessionMemberPanelProps) {
  const [peek, setPeek] = useState(false);
  const { member, attendanceState, plan } = sessionMember;
  const hasPlan = plan.kind !== "none";

  const menu = (
    <MemberAttendanceMenu
      fullName={`${member.name} ${member.lastname}`}
      attendanceState={attendanceState}
      onMarkPresent={onMarkPresent}
      onMarkAbsent={onMarkAbsent}
    />
  );

  if (attendanceState !== ATTENDANCE_STATE.PRESENT && !peek) {
    return (
      <MemberAttendancePanel
        sessionMember={sessionMember}
        onMarkPresent={onMarkPresent}
        onMarkAbsent={onMarkAbsent}
        onPeek={hasPlan ? () => setPeek(true) : undefined}
      />
    );
  }

  if (!hasPlan) {
    return (
      <div className="flex flex-col gap-5">
        <MemberPanelHeader sessionMember={sessionMember} actions={menu} />
        <SessionEmptyState
          icon={<CalendarOff size={22} aria-hidden="true" />}
          message="Sin plan activo"
          description="No tiene una planificación activa para entrenar hoy."
        />
      </div>
    );
  }

  return (
    <MemberPlanView
      sessionMember={sessionMember}
      position={position}
      onPositionChange={onPositionChange}
      menu={menu}
    />
  );
}

SessionMemberPanel.displayName = "SessionMemberPanel";
