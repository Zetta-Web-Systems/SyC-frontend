import { useRouter } from "@tanstack/react-router";
import { Button } from "@shared/ui";

interface GenericErrorProps {
  error: unknown;
  reset?: () => void;
}

export function GenericError({ error, reset }: GenericErrorProps) {
  const router = useRouter();

  const message =
    error instanceof Error ? error.message : "Ocurrio un error inesperado.";

  function handleReset() {
    if (reset) {
      reset();
    } else {
      router.invalidate();
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-xl border-l-4 border-error bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">
          Algo salio mal
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {message}
        </p>

        <div className="mt-5">
          <Button
            intent="primary"
            size="sm"
            onClick={handleReset}
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    </div>
  );
}

GenericError.displayName = "GenericError";
