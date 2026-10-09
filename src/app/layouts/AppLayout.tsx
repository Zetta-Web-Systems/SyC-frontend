import type { ReactNode } from "react";
import { Sidebar, MobileHeader } from "@app/components/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-dvh w-full font-sans text-neutral-900 bg-neutral-100">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 overflow-auto p-10 max-md:pt-18">{children}</main>
    </div>
  );
}
