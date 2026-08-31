import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
