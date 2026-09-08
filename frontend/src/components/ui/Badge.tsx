import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:
    'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
  success:
    'bg-[color:var(--success)/0.15] text-[var(--success)]',
  warning:
    'bg-[color:var(--warning)/0.15] text-[var(--warning)]',
  danger:
    'bg-[color:var(--danger)/0.15] text-[var(--danger)]',
  info:
    'bg-[color:var(--accent-primary)/0.15] text-[var(--accent-primary)]',
  purple:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
