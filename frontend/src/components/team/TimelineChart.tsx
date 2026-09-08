import { useMemo } from 'react';
import { GanttChart } from 'lucide-react';
import { format, differenceInDays, addDays, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import type { Task, ProjectMember } from '../../lib/types';

interface TimelineChartProps {
  tasks: Task[];
  members: ProjectMember[];
}

export default function TimelineChart({ tasks, members }: TimelineChartProps) {
  const activeTasks = tasks.filter((t) => t.status !== 'done' && t.assignedTo);

  const uniqueMembers = useMemo(() => {
    const map = new Map<string, ProjectMember['user']>();
    activeTasks.forEach((t) => {
      if (t.assignedTo && !map.has(t.assignedTo._id)) {
        map.set(t.assignedTo._id, t.assignedTo);
      }
    });
    return Array.from(map.values());
  }, [activeTasks]);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const totalDays = differenceInDays(weekEnd, weekStart) + 1;

  const dayLabels = Array.from({ length: totalDays }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      label: format(date, 'EEE'),
      dayNum: format(date, 'd'),
      isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
    };
  });

  const priorityColors: Record<string, string> = {
    urgent: 'var(--danger)',
    high: 'var(--warning)',
    medium: 'var(--accent-primary)',
    low: 'var(--text-tertiary)',
  };

  const getBarPosition = (task: Task) => {
    const start = parseISO(task.createdAt);
    const end = task.dueDate ? parseISO(task.dueDate) : addDays(start, 7);

    const effectiveStart = start < weekStart ? weekStart : start;
    const effectiveEnd = end > weekEnd ? weekEnd : end;

    const startDay = differenceInDays(effectiveStart, weekStart);
    const duration = Math.max(differenceInDays(effectiveEnd, effectiveStart) + 1, 1);

    return {
      left: `${(startDay / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  const todayPosition = ((differenceInDays(today, weekStart)) / totalDays) * 100;

  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--border-primary)] flex items-center gap-2">
        <GanttChart size={18} className="text-[var(--accent-primary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Timeline</h3>
        <span className="ml-auto text-xs text-[var(--text-tertiary)]">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex border-b border-[var(--border-primary)]">
            <div className="w-48 flex-shrink-0 px-4 py-2.5 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider border-r border-[var(--border-primary)]">
              Member
            </div>
            <div className="flex-1 flex relative">
              {dayLabels.map((day) => (
                <div
                  key={day.label + day.dayNum}
                  className={`flex-1 px-1 py-2 text-center border-r border-[var(--border-primary)] last:border-r-0 ${
                    day.isToday ? 'bg-[var(--accent-primary)]/5' : ''
                  }`}
                >
                  <div className="text-[10px] text-[var(--text-tertiary)] uppercase">{day.label}</div>
                  <div className={`text-xs font-medium ${day.isToday ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                    {day.dayNum}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {uniqueMembers.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--text-tertiary)]">
              No active tasks with assignments.
            </div>
          ) : (
            uniqueMembers.map((user) => {
              const memberTasks = activeTasks.filter((t) => t.assignedTo?._id === user._id);

              return (
                <div key={user._id} className="flex border-b border-[var(--border-primary)] last:border-b-0">
                  <div className="w-48 flex-shrink-0 px-4 py-3 flex items-center gap-2 border-r border-[var(--border-primary)]">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] text-[10px] font-bold flex-shrink-0">
                      {(user.fullName || user.username).split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <span className="text-sm text-[var(--text-primary)] truncate">{user.fullName || user.username}</span>
                  </div>
                  <div className="flex-1 relative py-2 min-h-[44px]">
                    {dayLabels.map((day, i) => (
                      <div
                        key={i}
                        className={`absolute top-0 bottom-0 border-r border-[var(--border-primary)] last:border-r-0 ${
                          day.isToday ? 'bg-[var(--accent-primary)]/5' : ''
                        }`}
                        style={{ left: `${(i / totalDays) * 100}%`, width: `${(1 / totalDays) * 100}%` }}
                      />
                    ))}

                    {memberTasks.map((task) => {
                      const pos = getBarPosition(task);
                      const color = priorityColors[task.priority] || 'var(--accent-primary)';

                      return (
                        <div
                          key={task._id}
                          className="absolute top-2 bottom-2 rounded-sm cursor-pointer hover:opacity-80 transition-opacity group"
                          style={{
                            left: pos.left,
                            width: pos.width,
                            backgroundColor: color,
                          }}
                        >
                          <div className="px-1.5 h-full flex items-center">
                            <span className="text-[10px] font-medium text-white truncate">
                              {task.title}
                            </span>
                          </div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {task.title}
                          </div>
                        </div>
                      );
                    })}

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[var(--danger)] z-10"
                      style={{ left: `${todayPosition}%` }}
                    >
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--danger)]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
