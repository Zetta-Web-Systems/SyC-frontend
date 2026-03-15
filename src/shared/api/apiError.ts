import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
}

const DEFAULT_ERROR_MESSAGE = "Ocurrió un error inesperado. Intentá de nuevo";

/**
 * Extrae el mensaje de error legible de cualquier error.
 * Prioriza el mensaje del backend (AxiosError → response.data.message),
 * luego Error.message, y finalmente un fallback genérico.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback: string = DEFAULT_ERROR_MESSAGE,
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export type { ApiErrorResponse };
