import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    to: "/projects",
    icon: BookOpen,
  },
  {
    label: "Teams",
    to: "/teams",
    icon: Users,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ sidebarOpen, toggleSidebar }) {
  return (
    <aside
      className={`flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              P
            </div>

            <span className="font-semibold text-gray-900">Project</span>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-5 ">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  sidebarOpen ? "gap-3" : "justify-center"
                } ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />

              {sidebarOpen && <span className="text-2xl">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-200 p-3">
        <button
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${
            sidebarOpen ? "gap-3" : "justify-center"
          }`}
        >
          <LogOut size={18} />

          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
