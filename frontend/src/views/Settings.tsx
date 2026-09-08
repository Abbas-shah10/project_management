import { User, Bell, Palette } from 'lucide-react';
import { useAppStore } from '../stores/app-store';

export default function Settings() {
  const { theme, toggleTheme, users } = useAppStore();
  const currentUser = users[0];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage your preferences</p>
      </div>

      <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg">
        <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center gap-2">
          <User size={18} className="text-[var(--accent-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Profile</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-1 block">Name</label>
              <div className="px-3 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md text-[var(--text-primary)]">
                {currentUser?.fullName || 'Not set'}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-1 block">Username</label>
              <div className="px-3 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md text-[var(--text-primary)]">
                @{currentUser?.username || 'Not set'}
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide mb-1 block">Email</label>
              <div className="px-3 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md text-[var(--text-primary)]">
                {currentUser?.email || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg">
        <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center gap-2">
          <Palette size={18} className="text-[var(--accent-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Appearance</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">Theme</div>
              <div className="text-xs text-[var(--text-tertiary)] mt-0.5">Switch between light and dark mode</div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg">
        <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center gap-2">
          <Bell size={18} className="text-[var(--accent-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Task assignments', desc: 'Get notified when assigned to a task' },
            { label: 'Task updates', desc: 'Get notified when a task is updated' },
            { label: 'Comments', desc: 'Get notified when someone comments' },
            { label: 'Due date reminders', desc: 'Get notified before task due dates' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)]">{item.label}</div>
                <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.desc}</div>
              </div>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--bg-tertiary)]"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
