import type { LucideIcon } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--bg-tertiary)">
        <Icon className="h-6 w-6 text-(--text-tertiary)" />
      </div>
      <h3 className="mb-1 text-sm font-medium text-(--text-primary)">
        {title}
      </h3>
      <p className="mb-4 max-w-full text-xs text-(--text-secondary) sm:max-w-xs">
        {description}
      </p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
