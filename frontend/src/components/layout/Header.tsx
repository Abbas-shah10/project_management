import { Bell, ChevronDown, Search, Sparkles } from "lucide-react";
import useAuthStore from "../../stores/authStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const initials = user?.username?.charAt(0).toUpperCase() || "A";

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 text-white sm:px-6">
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
          <Sparkles size={17} />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
          <p className="text-sm font-medium text-slate-200">Project overview</p>
        </div>
      </div>

      <div className="relative w-full max-w-md md:mx-8">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search projects, tasks, or people"
          aria-label="Search projects, tasks, or people"
          className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-16 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
        />
        <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:block">
          /
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="View notifications"
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-slate-800 hover:bg-slate-900 hover:text-white"
        >
          <Bell size={17} />
          <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-rose-400 ring-2 ring-slate-950" />
        </button>

        <div className="ml-1 hidden h-8 w-px bg-slate-800 sm:block" />

        <button
          type="button"
          aria-label="Open account menu"
          className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-cyan-500 text-xs font-bold text-slate-950">
            {initials}
          </span>
          <span className="hidden max-w-24 truncate text-xs font-medium text-slate-300 lg:block">
            {user?.username || "Account"}
          </span>
          <ChevronDown className="hidden text-slate-500 sm:block" size={14} />
        </button>
      </div>
    </header>
  );
}
