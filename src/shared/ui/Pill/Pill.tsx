import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { pillVariants } from "./Pill.variants";

type PillVariants = VariantProps<typeof pillVariants>;

interface PillCommonProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
  shape?: PillVariants["shape"];
  size?: PillVariants["size"];
  tone?: PillVariants["tone"];
  intent?: PillVariants["intent"];
  uppercase?: boolean;
}

export interface PillButtonProps
  extends
    PillCommonProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "className" | "children" | "type"
    > {
  interactive: true;
  ref?: Ref<HTMLButtonElement>;
  selected?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface PillSpanProps
  extends
    PillCommonProps,
    Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children" | "color"> {
  interactive?: false;
  ref?: Ref<HTMLSpanElement>;
}

export type PillProps = PillButtonProps | PillSpanProps;

function renderInner(
  leftIcon: ReactNode,
  rightIcon: ReactNode,
  children: ReactNode,
) {
  return (
    <>
      {leftIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {rightIcon}
        </span>
      )}
    </>
  );
}

export function Pill(props: PillProps) {
  if (props.interactive) {
    const {
      ref,
      selected = false,
      tone,
      intent,
      size,
      shape,
      uppercase,
      leftIcon,
      rightIcon,
      className,
      children,
      type = "button",
      disabled,
      interactive: _interactive,
      ...buttonProps
    } = props;
    void _interactive;
    const effectiveTone = selected ? "solid" : (tone ?? "outline");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={selected || undefined}
        className={cn(
          pillVariants({
            tone: effectiveTone,
            intent,
            size,
            shape,
            interactive: true,
            uppercase,
            disabled: disabled || undefined,
          }),
          className,
        )}
        {...buttonProps}
      >
        {renderInner(leftIcon, rightIcon, children)}
      </button>
    );
  }

  const {
    ref,
    tone,
    intent,
    size,
    shape,
    uppercase,
    leftIcon,
    rightIcon,
    className,
    children,
    interactive: _interactive,
    ...spanProps
  } = props;
  void _interactive;

  return (
    <span
      ref={ref}
      className={cn(
        pillVariants({
          tone,
          intent,
          size,
          shape,
          interactive: false,
          uppercase,
        }),
        className,
      )}
      {...spanProps}
    >
      {renderInner(leftIcon, rightIcon, children)}
    </span>
  );
}

Pill.displayName = "Pill";
