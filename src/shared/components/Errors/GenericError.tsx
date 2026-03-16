import { useRouter } from "@tanstack/react-router";
import { Button, buttonVariants } from "@shared/ui";
import { cn } from "@shared/lib/cn";

interface GenericErrorProps {
  error: unknown;
  reset?: () => void;
}

export function GenericError({ error, reset }: GenericErrorProps) {
  const router = useRouter();

  const message =
    error instanceof Error ? error.message : "Ocurrió un error inesperado.";

  function handleReset() {
    if (reset) {
      reset();
    } else {
      router.invalidate();
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-error">
        500
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
        Algo salió mal
      </h1>
      <p className="mt-4 max-w-sm text-base text-neutral-500">{message}</p>
      <div className="mt-8 flex gap-3">
        <Button type="button" intent="primary" onClick={handleReset}>
          Intentar de nuevo
        </Button>
        <a
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", intent: "neutral" }),
          )}
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
