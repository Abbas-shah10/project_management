interface ProgressBarProps {
  value: number;
  color?: string;
  size?: 'sm' | 'md';
}

export default function ProgressBar({ value, color = 'var(--accent-primary)', size = 'sm' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={`w-full bg-[var(--bg-tertiary)] rounded-full ${height}`}>
      <div
        className={`${height} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
