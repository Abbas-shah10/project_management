import { useMemo } from "react";
import {
  ClipboardList,
  AlertTriangle,
  FolderKanban,
  Users,
} from "lucide-react";
import { useAppStore } from "../stores/app-store";
import { MetricCard } from "../components/dashboard/MetricCard";
import { ActivityStream } from "../components/dashboard/ActivityStream";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Dashboard() {
  const tasks = useAppStore((s) => s.tasks);
  const projects = useAppStore((s) => s.projects);
  const activities = useAppStore((s) => s.activities);
  const members = useAppStore((s) => s.members);

  const metrics = useMemo(() => {
    const openTasks = tasks.filter((t) => t.status !== "done").length;
    const now = new Date();
    const overdueTasks = tasks.filter(
      (t) =>
        t.status !== "done" &&
        t.dueDate &&
        new Date(t.dueDate) < now
    ).length;
    const uniqueUserIds = new Set(
      members.map((m) => m.user._id)
    );
    return {
      openTasks,
      overdueTasks,
      totalProjects: projects.length,
      teamMembers: uniqueUserIds.size,
    };
  }, [tasks, projects, members]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={ClipboardList}
          label="Open Tasks"
          value={metrics.openTasks}
          color="var(--accent-primary)"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Overdue Tasks"
          value={metrics.overdueTasks}
          color="var(--danger)"
        />
        <MetricCard
          icon={FolderKanban}
          label="Total Projects"
          value={metrics.totalProjects}
          color="var(--success)"
        />
        <MetricCard
          icon={Users}
          label="Team Members"
          value={metrics.teamMembers}
          color="#8b5cf6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityStream activities={activities} />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">
            Projects
          </h3>
          {projects.length === 0 ? (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-8 text-center">
              <p className="text-[var(--text-tertiary)] text-sm">
                No projects yet
              </p>
            </div>
          ) : (
            projects.map((project) => {
              const projectTasks = tasks.filter(
                (t) => t.project === project._id
              );
              const completedCount = projectTasks.filter(
                (t) => t.status === "done"
              ).length;
              const progress =
                projectTasks.length > 0
                  ? Math.round((completedCount / projectTasks.length) * 100)
                  : 0;
              const projectMembers = members.filter(
                (m) => m.project === project._id
              );
              const displayedMembers = projectMembers.slice(0, 3);
              const extraCount = projectMembers.length - 3;

              return (
                <div
                  key={project._id}
                  className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-[var(--text-primary)] text-sm">
                      {project.name}
                    </h4>
                    <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
                      {projectTasks.length} tasks
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent-primary)] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    {displayedMembers.map((m) => (
                      <div
                        key={m._id}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-medium -ml-1.5 first:ml-0 border-2 border-[var(--bg-secondary)] ${getAvatarColor(
                          m.user._id
                        )}`}
                        title={m.user.fullName}
                      >
                        {getInitials(m.user.fullName)}
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-secondary)] text-[10px] font-medium -ml-1.5 bg-[var(--bg-tertiary)] border-2 border-[var(--bg-secondary)]">
                        +{extraCount}
                      </div>
                    )}
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
