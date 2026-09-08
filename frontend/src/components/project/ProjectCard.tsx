import { format } from "date-fns";
import type { Project, Task, ProjectMember } from "../../lib/types";

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  members: ProjectMember[];
  onClick: () => void;
}

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

export function ProjectCard({
  project,
  tasks,
  members,
  onClick,
}: ProjectCardProps) {
  const completedCount = tasks.filter((t) => t.status === "done").length;
  const progress =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : 0;
  const displayedMembers = members.slice(0, 3);
  const extraCount = members.length - 3;

  return (
    <div
      onClick={onClick}
      className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-[var(--text-primary)]">
          {project.name}
        </h3>
        <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
          {tasks.length} tasks
        </span>
      </div>

      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
        {project.description || "No description"}
      </p>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1">
          <span>Completion</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-primary)] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
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
        <span className="text-xs text-[var(--text-tertiary)]">
          {format(new Date(project.createdAt), "MMM d, yyyy")}
        </span>
      </div>
    </div>
  );
}
