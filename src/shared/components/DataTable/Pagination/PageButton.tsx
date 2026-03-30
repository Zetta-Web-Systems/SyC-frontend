import { Button } from "@shared/ui";

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

export function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <Button
      variant={isActive ? "solid" : "ghost"}
      intent={isActive ? "primary" : "neutral"}
      size="icon"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className="h-8 w-8 rounded-lg text-sm"
    >
      {page}
    </Button>
  );
}

PageButton.displayName = "PageButton";
