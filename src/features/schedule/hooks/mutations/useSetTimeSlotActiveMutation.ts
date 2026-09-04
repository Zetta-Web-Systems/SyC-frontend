import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTimeSlot, restoreTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useSetTimeSlotActiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeSlotId,
      isActive,
    }: {
      timeSlotId: string;
      isActive: boolean;
    }) => (isActive ? restoreTimeSlot(timeSlotId) : deleteTimeSlot(timeSlotId)),
    onSuccess: (_data, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success(isActive ? "Horario abierto" : "Horario cerrado", {
        description: isActive
          ? "El horario fue habilitado nuevamente para ese día. A los alumnos que estaban anotados hay que volver a anotarlos."
          : "El horario fue cerrado para ese día. Los alumnos anotados quedaron sin turno.",
      });
    },
  });
}
