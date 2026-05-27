import type { ReactNode } from "react";
import { AlertTriangle, Inbox } from "lucide-react";
import { Spinner } from "@shared/ui";
import { cn } from "@shared/lib/cn";

type ListStateKind = "loading" | "empty" | "error";

export interface ListStateProps {
  kind: ListStateKind;
  icon?: ReactNode;
  message?: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "inline" | "block" | "dashed-card";
  className?: string;
}

const DEFAULT_MESSAGE: Record<ListStateKind, string> = {
  loading: "Cargando",
  empty: "Sin resultados",
  error: "Ocurrió un error.",
};

function DefaultIcon({ kind, size }: { kind: ListStateKind; size: number }) {
  if (kind === "loading") return <Spinner size="sm" />;
  if (kind === "error") return <AlertTriangle size={size} aria-hidden="true" />;
  return <Inbox size={size} aria-hidden="true" />;
}

export function ListState({
  kind,
  icon,
  message,
  description,
  size = "md",
  variant,
  className,
}: ListStateProps) {
  const resolvedVariant = variant ?? (kind === "empty" ? "block" : "inline");

  const iconSize = size === "sm" ? 14 : size === "lg" ? 22 : 18;
  const resolvedIcon = icon ?? <DefaultIcon kind={kind} size={iconSize} />;
  const resolvedMessage = message ?? DEFAULT_MESSAGE[kind];

  if (resolvedVariant === "inline") {
    return (
      <div
        role={kind === "error" ? "alert" : "status"}
        className={cn(
          "flex items-center justify-center gap-2",
          size === "sm" ? "py-1.5 text-[11px]" : "py-2 text-[12px]",
          kind === "error" ? "text-error" : "text-neutral-500",
          className,
        )}
      >
        <span className="inline-flex shrink-0">{resolvedIcon}</span>
        <span>{resolvedMessage}</span>
      </div>
    );
  }

  const wrapperClass =
    resolvedVariant === "dashed-card"
      ? "rounded-xl border-[1.5px] border-dashed border-neutral-300 bg-white"
      : "";

  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm"
          ? "gap-1.5 px-3 py-4 text-[12px]"
          : size === "lg"
            ? "gap-3 px-4 py-10 text-[14px]"
            : "gap-2 px-3.5 py-7 text-[12.5px]",
        kind === "error" ? "text-error" : "text-neutral-500",
        wrapperClass,
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex shrink-0",
          kind === "error" ? "text-error" : "text-neutral-400",
        )}
      >
        {resolvedIcon}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{resolvedMessage}</span>
        {description && (
          <span className="text-[11px] text-neutral-500">{description}</span>
        )}
      </div>
    </div>
  );
}

ListState.displayName = "ListState";
