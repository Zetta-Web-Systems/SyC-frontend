import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@shared/ui";

export function UnderConstruction() {
  const router = useRouter();

  function handleGoBack() {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <img
        src="/images/errors/under_construction.png"
        alt="Página en construcción"
        className="w-full max-w-md object-contain"
      />

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary-500 sm:text-4xl md:text-5xl">
        Página en construcción
      </h1>

      <p className="mt-3 max-w-sm text-center text-base text-neutral-500">
        Esta sección todavía está en construcción
      </p>

      <Button intent="primary" className="mt-4 gap-2" onClick={handleGoBack}>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>
    </div>
  );
}

UnderConstruction.displayName = "UnderConstruction";
