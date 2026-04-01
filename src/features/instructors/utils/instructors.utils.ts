interface LastLoginInfo {
  label: string;
  intent: "success" | "info" | "warning" | "error" | "neutral";
}

/**
 * Utilidad para formatear la información de la última conexión de un instructor.
 * Devuelve una etiqueta legible y un intent para indicar la frescura de la conexión.
 * @example
 * - "Today at HH:MM" (verde) si fue hoy.
 */
export function getLastLoginInfo(lastLoginAt: string | null): LastLoginInfo {
  if (!lastLoginAt) {
    return { label: "NUNCA", intent: "error" };
  }

  const loginDate = new Date(lastLoginAt);
  const now = new Date();

  const diffTime = now.getTime() - loginDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isToday =
    loginDate.getDate() === now.getDate() &&
    loginDate.getMonth() === now.getMonth() &&
    loginDate.getFullYear() === now.getFullYear();

  if (isToday) {
    const time = loginDate.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { label: `HOY a las ${time}`, intent: "success" };
  }

  if (diffDays >= 1 && diffDays <= 5) {
    return {
      label: `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`,
      intent: "info",
    };
  }

  if (diffDays >= 6 && diffDays <= 29) {
    return { label: `Hace ${diffDays} días`, intent: "warning" };
  }

  return { label: "Hace 30+ días", intent: "error" };
}
