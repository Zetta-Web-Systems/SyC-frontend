import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-700 px-6 py-12">
      <div className="w-full max-w-120">{children}</div>
    </div>
  );
}
