import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import {
  describeSlotDays,
  findOverlappingSlots,
} from "../../lib/scheduleOverlap";
import { getSlotsInRow, runRowOperation } from "../../lib/scheduleRows";
import type {
  TimeSlot,
  UpdateTimeSlotDto,
  UpdateTimeSlotScope,
} from "../../types";

interface UpdateTimeSlotVariables {
  slot: TimeSlot;
  dto: UpdateTimeSlotDto;
  scope: UpdateTimeSlotScope;
  weekSlots: TimeSlot[];
}

export function useUpdateTimeSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slot, dto, scope, weekSlots }: UpdateTimeSlotVariables) => {
      const rowMates =
        scope === "row"
          ? getSlotsInRow(weekSlots, slot.startTime).filter(
              (rowMate) => rowMate.id !== slot.id,
            )
          : [];

      const targets = [slot, ...rowMates];

      if (dto.startTime && dto.endTime) {
        const conflicts = findOverlappingSlots(weekSlots, {
          startTime: dto.startTime,
          endTime: dto.endTime,
          days: targets.map((target) => target.dayOfWeek),
          excludedSlotIds: new Set(targets.map((target) => target.id)),
        });

        if (conflicts.length > 0) {
          throw new Error(
            `Ese horario se pisa con otro que ya existe los días: ${describeSlotDays(conflicts)}.`,
          );
        }
      }

      return runRowOperation(
        targets,
        (target) =>
          updateTimeSlot(
            target.id,
            target.id === slot.id
              ? dto
              : { startTime: dto.startTime, endTime: dto.endTime },
          ),
        { done: "actualizado", action: "actualizar" },
      );
    },
    onSuccess: (_data, { scope }) => {
      toast.success("Horario actualizado", {
        description:
          scope === "row"
            ? "El horario fue actualizado correctamente en toda la semana."
            : "El horario fue actualizado correctamente para ese día.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
}
