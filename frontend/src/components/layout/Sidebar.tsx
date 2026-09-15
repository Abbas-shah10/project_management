import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "../../stores/app-store";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/team", label: "Team", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`flex flex-col overflow-hidden border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 ${
        sidebarOpen ? "w-60" : "w-[4.5rem]"
      }`}
    >
      <div
        className={`flex h-14 items-center border-b border-[var(--border-primary)] px-3 ${
          sidebarOpen ? "justify-between" : "justify-center"
        }`}
      >
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent-primary)]/10 text-[10px] font-bold text-[var(--accent-primary)] shadow-inner">
              PM
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] text-[var(--text-primary)] uppercase">
              PM
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent-primary)]/40 hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            title={item.label}
            className={({ isActive }) =>
              `group relative flex items-center rounded-xl px-2.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                sidebarOpen ? "gap-3" : "justify-center"
              } ${
                isActive
                  ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-[inset_0_0_0_1px_rgba(var(--accent-primary-rgb),0.12)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-1.5 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent-primary)] transition-all duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="border-t border-[var(--border-primary)] px-3 py-3">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-primary)] px-2.5 py-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[10px] font-bold text-white shadow-sm">
              U
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                User
              </p>
              <p className="truncate text-[10px] text-[var(--text-tertiary)]">
                user@email.com
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
