import { Search, Bell } from "lucide-react";
import useAuthStore from "../../stores/authStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <header className="h-12 flex w-full items-center justify-between px-4 bg-[(--bg-primary)] border-b  shrink-0">
        <div className="flex justify-between items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 h-7 pl-7 pr-2 text-xs bg-[(--bg-tertiary)] border border-[(--border-primary)] rounded-md text-[(--text-primary)] placeholder-[(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[(--accent-primary)] transition-colors"
            />
          </div>

          <div>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-[(--text-secondary)] hover:bg-[(--bg-hover)] hover:text-[(--text-primary)] transition-colors relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[(--danger)] rounded-full" />
            </button>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold cursor-pointer bg-blue-400">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>
    </>
  );
}
