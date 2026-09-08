import { useAppStore } from '../stores/app-store';
import TeamGrid from '../components/team/TeamGrid';
import TimelineChart from '../components/team/TimelineChart';

export default function Team() {
  const members = useAppStore((s) => s.members);
  const tasks = useAppStore((s) => s.tasks);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team Workload</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Monitor team capacity and task distribution</p>
      </div>

      <TeamGrid members={members} tasks={tasks} />
      <TimelineChart tasks={tasks} members={members} />
    </div>
  );
}
