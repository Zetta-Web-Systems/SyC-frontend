import { Spinner } from "@shared/ui";
import type { SpinnerProps } from "@shared/ui/Spinner/Spinner";
import { cn } from "@shared/lib/cn";

interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
  spinnerSize?: SpinnerProps["size"];
  className?: string;
}

export function LoadingState({
  message,
  fullHeight = false,
  spinnerSize = "md",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12",
        fullHeight && "min-h-[calc(100dvh-10rem)]",
        className,
      )}
    >
      <Spinner size={spinnerSize} label={message} />
    </div>
  );
}

LoadingState.displayName = "LoadingState";
