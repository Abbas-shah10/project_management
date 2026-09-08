import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  change?: { value: number; positive: boolean };
  color?: string;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  color,
}: MetricCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg p-4 flex items-start gap-4">
      <div
        className="rounded-lg p-2.5"
        style={{ backgroundColor: color ? `${color}15` : "var(--bg-tertiary)" }}
      >
        <Icon
          size={20}
          style={{ color: color || "var(--accent-primary)" }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text-secondary)] truncate">{label}</p>
        <p className="text-2xl font-semibold text-[var(--text-primary)] mt-0.5">
          {value}
        </p>
        {change && (
          <p
            className={`text-xs mt-1 ${
              change.positive ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {change.positive ? "+" : ""}
            {change.value}%
          </p>
        )}
      </div>
    </div>
  );
}
