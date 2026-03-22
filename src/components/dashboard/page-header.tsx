"use client";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white font-display tracking-tight">{title}</h2>
        {description && <p className="text-sm text-white/40 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
