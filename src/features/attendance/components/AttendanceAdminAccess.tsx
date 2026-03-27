import { useCallback } from "react";
// import { Settings } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { confirm } from "@shared/stores/confirm.store";
import { useLogoutMutation } from "@features/auth";
import { useAttendanceLongPress } from "../hooks/useAttendanceLongPress";

interface AttendanceAdminAccessProps {
  visible: boolean;
}

export function AttendanceAdminAccess({ visible }: AttendanceAdminAccessProps) {
  const logoutMutation = useLogoutMutation();

  const handleLogout = useCallback(() => {
    confirm({
      intent: "danger",
      title: "Cerrar sesión",
      description: "Se cerrará la sesión del dispositivo",
      confirmLabel: "Cerrar sesión",
      onConfirm: async () => {
        await logoutMutation.mutateAsync();
      },
    });
  }, [logoutMutation]);

  const longPress = useAttendanceLongPress(handleLogout);

  return (
    <div
      className={cn(
        "transition-opacity duration-200",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div
        {...longPress.handlers}
        className="fixed bottom-0 left-0 z-40 flex h-16 w-16 items-center justify-center"
        aria-label="Mantener presionado para opciones de administración"
      >
        {longPress.isPressed && (
          <svg
            className="absolute h-12 w-12"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-primary-300"
              strokeWidth="2"
              strokeDasharray="100"
              style={{
                strokeDashoffset: 100 - longPress.progress * 100,
                transition: "stroke-dashoffset 50ms linear",
              }}
            />
          </svg>
        )}
      </div>

      {/* <button
        type="button"
        onClick={handleLogout}
        className="fixed bottom-4 right-4 z-40 text-primary-200 opacity-30 transition-opacity duration-300 hover:opacity-60"
        aria-label="Opciones de administración"
      >
        <Settings size={16} />
      </button> */}
    </div>
  );
}

AttendanceAdminAccess.displayName = "AttendanceAdminAccess";
