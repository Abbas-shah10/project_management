import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAuthStore from "../../stores/authStore";

const mainItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    to: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Teams",
    to: "/teams",
    icon: Users,
  },
];

const workspaceItems = [
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthStore();
  return (
    <aside
      className={`
        sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-800
        bg-slate-950 text-white
        transition-all duration-300
        ${sidebarOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
              P
            </div>

            <div>
              <h1 className="text-sm font-semibold">ProjectHub</h1>
              <p className="text-xs text-slate-500">Project Manager</p>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="
            flex h-8 w-8 items-center justify-center
            rounded-lg text-slate-400
            transition hover:bg-slate-800 hover:text-white
          "
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {/* Main */}
        {sidebarOpen && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main
          </p>
        )}

        <div className="space-y-1">
          {mainItems.map((item) => (
            <SidebarItem key={item.to} item={item} sidebarOpen={sidebarOpen} />
          ))}
        </div>

        {/* Workspace */}
        <div className="mt-7">
          {sidebarOpen && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workspace
            </p>
          )}

          <div className="space-y-1">
            {workspaceItems.map((item) => (
              <SidebarItem
                key={item.to}
                item={item}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* User / Logout */}
      <div className="border-t border-slate-800 p-3">
        {sidebarOpen && (
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>
        )}

        <button
          className={`
            flex w-full items-center rounded-lg
            px-3 py-2.5
            text-sm font-medium
            text-slate-400
            transition
            hover:bg-red-500/10
            hover:text-red-400
            ${sidebarOpen ? "gap-3" : "justify-center"}
          `}
          onClick={logout}
        >
          <LogOut size={18} />

          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
  interface SidebarItemProps {
    item: {
      label: string;
      to: string;
      icon: React.ComponentType<{ size: number; strokeWidth?: number }>;
    };
    sidebarOpen: boolean;
  }

  /* Reusable navigation item */
  function SidebarItem({ item, sidebarOpen }: SidebarItemProps) {
    const Icon = item.icon;

    return (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `
        group flex items-center rounded-lg
        px-3 py-2.5
        text-sm font-medium
        transition-all duration-200
        ${sidebarOpen ? "gap-3" : "justify-center"}

        ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }
        `
        }
      >
        <Icon size={18} strokeWidth={2} />

        {sidebarOpen && <span>{item.label}</span>}
      </NavLink>
    );
  }
}
