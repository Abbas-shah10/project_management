import { Search, Bell } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="h-12 flex items-center justify-between px-4 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] shrink-0">
      <h1 className="text-sm font-semibold text-[var(--text-primary)]">
        {title}
      </h1>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 h-7 pl-7 pr-2 text-xs bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-md text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-colors"
          />
        </div>

        <button className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--danger)] rounded-full" />
        </button>

        <ThemeToggle />

        <div className="w-7 h-7 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-white text-[10px] font-bold cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
