import { useRouter } from "@tanstack/react-router";
import { Button } from "@shared/ui";
import { ArrowLeft } from "lucide-react";

interface ErrorComponentProps {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export function ErrorComponent({
  image,
  imageAlt,
  title,
  description,
}: ErrorComponentProps) {
  const router = useRouter();

  function handleGoBack() {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <img
        src={image}
        alt={imageAlt}
        className="w-full max-w-2xl object-contain"
      />

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-primary-500 sm:text-4xl md:text-5xl">
        {title}
      </h1>

      <p className="mt-3 max-w-sm text-center text-base text-neutral-500">
        {description}
      </p>

      <Button intent="primary" className="mt-4 gap-2" onClick={handleGoBack}>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>
    </div>
  );
}

ErrorComponent.displayName = "ErrorComponent";
