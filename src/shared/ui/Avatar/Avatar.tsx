import { useState } from "react";
import type { ImgHTMLAttributes, ReactNode, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { avatarVariants } from "./Avatar.variants";

export interface AvatarProps
  extends
    Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "color">,
    VariantProps<typeof avatarVariants> {
  ref?: Ref<HTMLSpanElement>;
  src?: string | null;
  fallback: ReactNode;
}

export function Avatar({
  ref,
  src,
  fallback,
  size,
  color,
  className,
  alt,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;
  const ariaLabel =
    alt ?? (typeof fallback === "string" ? fallback : undefined);
  const imgAlt = alt ?? (typeof fallback === "string" ? fallback : "");

  return (
    <span
      ref={ref}
      className={cn(avatarVariants({ size, color }), className)}
      role="img"
      aria-label={ariaLabel}
    >
      {showImage ? (
        <img
          src={src}
          alt={imgAlt}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
          {...props}
        />
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center"
        >
          {fallback}
        </span>
      )}
    </span>
  );
}

Avatar.displayName = "Avatar";
