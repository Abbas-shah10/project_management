import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../stores/app-store';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] transition-all duration-200 ${
        sidebarOpen ? 'w-52' : 'w-14'
      }`}
    >
      <div className="flex items-center justify-between h-12 px-3 border-b border-[var(--border-primary)]">
        {sidebarOpen && (
          <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
            PM
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 flex items-center justify-center rounded text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <nav className="flex-1 py-2 px-1.5 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="px-3 py-3 border-t border-[var(--border-primary)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              U
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                User
              </p>
              <p className="text-[10px] text-[var(--text-tertiary)] truncate">
                user@email.com
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
