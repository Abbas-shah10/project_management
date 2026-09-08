import { formatDistanceToNow } from "date-fns";
import type { Activity } from "../../lib/types";

interface ActivityStreamProps {
  activities: Activity[];
}

const ACTIVITY_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACTIVITY_COLORS[Math.abs(hash) % ACTIVITY_COLORS.length];
}

export function ActivityStream({ activities }: ActivityStreamProps) {
  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-lg p-8 text-center">
        <p className="text-[var(--text-tertiary)] text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg">
      <div className="px-4 py-3 border-b border-[var(--border-primary)]">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          Recent Activity
        </h3>
      </div>
      <div className="divide-y divide-[var(--border-primary)]">
        {sorted.map((activity) => (
          <div key={activity._id} className="px-4 py-3 flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${getColorForUser(
                activity.user._id
              )}`}
            >
              {getInitials(activity.user.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text-primary)]">
                <span className="font-medium">{activity.user.fullName}</span>{" "}
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[var(--text-tertiary)]">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                {activity.projectName && (
                  <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded">
                    {activity.projectName}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
