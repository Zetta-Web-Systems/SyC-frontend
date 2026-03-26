import type { ReactNode } from "react";
import { Sidebar, MobileMenuButton } from "@app/components/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full font-sans text-neutral-900 bg-neutral-100">
      <Sidebar />
      <MobileMenuButton />
      <main className="flex-1 overflow-auto p-10">{children}</main>
    </div>
  );
}
