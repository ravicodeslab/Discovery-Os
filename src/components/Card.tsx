import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Card({
  title,
  icon,
  children,
  variant = 'default',
  className = '',
}: CardProps) {
  const variantStyles = {
    default: 'border-white/10 bg-slate-900/50',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    error: 'border-error/30 bg-error/5',
    info: 'border-primary-500/30 bg-primary-500/5',
  };

  return (
    <div className={`card rounded-xl border ${variantStyles[variant]} p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
