import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { useEffect } from "react";
import type { VariantProps } from "class-variance-authority";
import { ChevronUp } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { useDropdown } from "@shared/hooks/useDropdown";
import { Button } from "../Button/Button";
import { fabToggleVariants, fabVariants } from "./Fab.variants";

const POSITION_CLASS = "fixed right-6 bottom-6";

export interface FabProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof fabVariants> {
  ref?: Ref<HTMLButtonElement>;
  icon?: ReactNode;
  badge?: ReactNode;
  visible?: boolean;
  positionClassName?: string;
  children?: ReactNode;
}

export function Fab({
  ref,
  shape,
  intent,
  icon,
  badge,
  visible = true,
  positionClassName = POSITION_CLASS,
  className,
  children,
  ...props
}: FabProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        positionClassName,
        fabVariants({ shape, intent }),
        !visible && "pointer-events-none translate-y-4 opacity-0",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {badge !== undefined && (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

Fab.displayName = "Fab";

export interface FabSpeedDialItem {
  key: string;
  label: string;
  icon?: ReactNode;
  intent: "neutral" | "primary" | "danger";
  variant: "outline" | "solid";
  type?: "button" | "submit";
  form?: string;
  isLoading?: boolean;
  onClick: () => void;
}

export interface FabSpeedDialProps {
  items: FabSpeedDialItem[];
  ariaLabel?: string;
  visible?: boolean;
  positionClassName?: string;
  toggleIntent?: "primary" | "neutral";
}

export function FabSpeedDial({
  items,
  ariaLabel = "Acciones",
  visible = true,
  positionClassName = POSITION_CLASS,
  toggleIntent = "primary",
}: FabSpeedDialProps) {
  const { isOpen, toggle, close, containerRef } = useDropdown<HTMLDivElement>();

  useEffect(() => {
    if (!visible && isOpen) close();
  }, [visible, isOpen, close]);

  return (
    <div
      ref={containerRef}
      className={cn(
        positionClassName,
        "pointer-events-none z-60 flex flex-col items-end gap-3 transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-end gap-2 transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        {items.map((item, idx) => (
          <div
            key={item.key}
            className={cn(
              "transition-all duration-200",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
            style={{
              transitionDelay: isOpen
                ? `${idx * 60}ms`
                : `${(items.length - 1 - idx) * 30}ms`,
            }}
          >
            <Button
              intent={item.intent}
              variant={item.variant}
              type={item.type}
              form={item.form}
              isLoading={item.isLoading}
              onClick={() => {
                item.onClick();
                close();
              }}
              className={cn(
                "shadow-lg",
                item.variant === "outline" && "bg-white",
              )}
            >
              {item.icon}
              {item.label}
            </Button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={cn("pointer-events-auto", fabToggleVariants({ intent: toggleIntent }))}
      >
        <ChevronUp
          size={18}
          aria-hidden="true"
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
    </div>
  );
}

FabSpeedDial.displayName = "FabSpeedDial";
