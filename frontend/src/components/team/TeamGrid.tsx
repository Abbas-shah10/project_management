import { Users } from 'lucide-react';
import type { ProjectMember, Task } from '../../lib/types';

interface TeamGridProps {
  members: ProjectMember[];
  tasks: Task[];
}

export default function TeamGrid({ members, tasks }: TeamGridProps) {
  const MAX_CAPACITY = 5;

  const uniqueMembers = members.reduce<{ user: ProjectMember['user']; projects: string[] }[]>((acc, m) => {
    const existing = acc.find((a) => a.user._id === m.user._id);
    if (existing) {
      existing.projects.push(m.project);
    } else {
      acc.push({ user: m.user, projects: [m.project] });
    }
    return acc;
  }, []);

  const memberWorkloads = uniqueMembers.map(({ user, projects }) => {
    const taskCount = tasks.filter(
      (t) => t.assignedTo?._id === user._id && t.status !== 'done'
    ).length;

    const memberProjects = members
      .filter((m) => m.user._id === user._id)
      .map((m) => m.role);

    return { user, taskCount, projects, role: memberProjects[0] || 'member' };
  });

  memberWorkloads.sort((a, b) => b.taskCount - a.taskCount);

  const getCapacityColor = (count: number) => {
    if (count >= MAX_CAPACITY) return 'var(--danger)';
    if (count >= 3) return 'var(--warning)';
    return 'var(--success)';
  };

  const getStatusLabel = (count: number) => {
    if (count >= MAX_CAPACITY) return 'Overloaded';
    if (count >= 3) return 'Moderate';
    if (count > 0) return 'Available';
    return 'Idle';
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
    'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
  ];

  const getAvatarColor = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center gap-2">
        <Users size={18} className="text-[var(--accent-primary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Resource Allocation</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-primary)]">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Member</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Tasks</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Capacity</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {memberWorkloads.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-sm text-[var(--text-tertiary)]">
                  No team members found.
                </td>
              </tr>
            ) : (
              memberWorkloads.map(({ user, taskCount, role }) => (
                <tr key={user._id} className="border-b border-[var(--border-primary)] last:border-b-0 hover:bg-[var(--bg-hover)] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${getAvatarColor(user._id)} flex items-center justify-center text-white text-xs font-medium`}>
                        {getInitials(user.fullName || user.username)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">{user.fullName || user.username}</div>
                        <div className="text-xs text-[var(--text-tertiary)]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm capitalize text-[var(--text-secondary)]">{role.replace('_', ' ')}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{taskCount}</span>
                  </td>
                  <td className="px-5 py-3 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((taskCount / MAX_CAPACITY) * 100, 100)}%`,
                            backgroundColor: getCapacityColor(taskCount),
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)] w-6 text-right">{taskCount}/{MAX_CAPACITY}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: `${getCapacityColor(taskCount)}20`,
                        color: getCapacityColor(taskCount),
                      }}
                    >
                      {getStatusLabel(taskCount)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
