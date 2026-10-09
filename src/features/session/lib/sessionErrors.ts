import { AxiosError } from "axios";

const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;

export function isNotFoundError(error: unknown): boolean {
  return (
    error instanceof AxiosError && error.response?.status === HTTP_NOT_FOUND
  );
}

export function isClientError(error: unknown): boolean {
  return (
    error instanceof AxiosError &&
    (error.response?.status === HTTP_NOT_FOUND ||
      error.response?.status === HTTP_CONFLICT)
  );
}
