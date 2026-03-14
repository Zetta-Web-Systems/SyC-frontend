import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

interface NavItem {
  label: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [{ label: "Dashboard", to: "/" }];

function Sidebar() {
  const { location } = useRouterState();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-neutral-900 p-6">
      {/* TODO: Hacer componente */}

      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
          <span className="text-lg font-bold text-secondary-500">
            S<span className="text-primary-500">C</span>
          </span>
        </div>
        <h1 className="text-lg font-black tracking-tighter text-white">
          S&C Gym
        </h1>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-neutral-100 font-sans text-neutral-900">
      <Sidebar />
      <main className="flex-1 overflow-auto p-10">{children}</main>
    </div>
  );
}
