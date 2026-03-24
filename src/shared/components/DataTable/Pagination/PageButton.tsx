import { cn } from "@shared/lib/cn";

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

export function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary-500 text-white shadow-sm"
          : "bg-neutral-50 text-neutral-600 hover:bg-primary-50 hover:text-primary-600",
      )}
    >
      {page}
    </button>
  );
}

PageButton.displayName = "PageButton";
