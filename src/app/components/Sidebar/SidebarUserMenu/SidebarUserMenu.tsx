import { useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { confirm } from "@shared/stores/confirm.store";
import { Avatar } from "@shared/ui";
import { Popover, PopoverItem, PopoverSeparator } from "@shared/ui";
import { useAuthStore, useLogoutMutation } from "@features/auth";
import { ROLE_AVATAR_COLOR } from "@app/constants/sidebar.constants";
import { getUserInitials, getDisplayName } from "@app/utils/sidebar.utils";

interface SidebarUserMenuProps {
  collapsed: boolean;
}

export function SidebarUserMenu({ collapsed }: SidebarUserMenuProps) {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogoutMutation();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = getUserInitials(user.email, user.firstName, user.lastName);
  const fullName = getDisplayName(user.email, user.firstName, user.lastName);
  const avatarColor = ROLE_AVATAR_COLOR[user.role];

  function handleLogoutClick() {
    setOpen(false);
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

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-800",
        collapsed && "justify-center",
      )}
    >
      <Avatar
        src={user.avatarUrl}
        fallback={initials}
        size="sm"
        color={avatarColor}
      />

      {!collapsed && (
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium text-white">{fullName}</p>
          <p className="truncate text-xs text-neutral-400">{user.email}</p>
        </div>
      )}
    </button>
  );

  return (
    <div className="mt-auto border-t border-neutral-800 pt-3">
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        trigger={trigger}
        side="right"
        align="end"
      >
        <PopoverItem onClick={() => setOpen(false)} icon={<User size={16} />}>
          Mi perfil
        </PopoverItem>

        <PopoverItem
          onClick={() => setOpen(false)}
          icon={<Settings size={16} />}
        >
          Configuración
        </PopoverItem>

        <PopoverSeparator />

        <PopoverItem
          onClick={handleLogoutClick}
          icon={<LogOut size={16} />}
          variant="danger"
        >
          Cerrar sesión
        </PopoverItem>
      </Popover>
    </div>
  );
}
