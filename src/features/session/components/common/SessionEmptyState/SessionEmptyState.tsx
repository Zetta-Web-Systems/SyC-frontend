import type { ReactNode } from "react";
import { ListState } from "@shared/components/ListState";
import { cn } from "@shared/lib/cn";

interface SessionEmptyStateProps {
  icon: ReactNode;
  message: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SessionEmptyState({
  icon,
  message,
  description,
  action,
  className,
}: SessionEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border-[1.5px] border-dashed border-neutral-300 bg-white",
        action && "pb-8",
        className,
      )}
    >
      <ListState
        kind="empty"
        size="lg"
        icon={icon}
        message={message}
        description={description}
      />
      {action}
    </div>
  );
}

SessionEmptyState.displayName = "SessionEmptyState";
