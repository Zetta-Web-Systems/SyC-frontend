import { LogOut } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { confirm } from "@shared/stores/confirm.store";
import { Avatar, Button } from "@shared/ui";
import { useAuthStore, useLogoutMutation } from "@features/auth";
import {
  ROLE_AVATAR_COLOR,
  ROLE_DISPLAY_LABEL,
} from "@app/constants/sidebar.constants";
import { getUserInitials, getDisplayName } from "@app/utils/sidebar.utils";

interface SidebarUserMenuProps {
  collapsed: boolean;
}

export function SidebarUserMenu({ collapsed }: SidebarUserMenuProps) {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogoutMutation();

  if (!user) return null;

  const initials = getUserInitials(user.email, user.firstName, user.lastName);
  const fullName = getDisplayName(user.email, user.firstName, user.lastName);
  const avatarColor = ROLE_AVATAR_COLOR[user.role];
  const roleLabel = ROLE_DISPLAY_LABEL[user.role];

  function handleLogoutClick() {
    confirm({
      intent: "danger",
      title: "Cerrar sesión",
      description:
        "¿Estás seguro que querés cerrar sesión? Vas a tener que volver a ingresar tus credenciales.",
      confirmLabel: "Cerrar sesión",
      onConfirm: async () => {
        await logoutMutation.mutateAsync();
      },
    });
  }

  return (
    <div
      className={cn("border-t border-neutral-200 p-3", collapsed && "px-2")}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg p-2",
          collapsed && "justify-center",
        )}
      >
        <div className="relative">
          <Avatar
            src={user.avatarUrl}
            fallback={initials}
            size="sm"
            color={avatarColor}
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-neutral-50 bg-success" />
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {fullName}
              </p>
              <p className="truncate text-xs text-neutral-400">{roleLabel}</p>
            </div>

            <Button
              variant="ghost"
              intent="neutral"
              size="icon"
              onClick={handleLogoutClick}
              className="h-8 w-8 shrink-0"
              aria-label="Cerrar sesión"
            >
              <LogOut size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
