import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center px-6 py-12 min-h-screen bg-primary-700">
      <div className="w-full max-w-120">{children}</div>
    </div>
  );
}
