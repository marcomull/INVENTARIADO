import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  variant?: 'primary' | 'accent' | 'secondary' | 'info';
  delta?: { value: number; positive?: boolean };
  hint?: string;
}

const VARIANT: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent-foreground',
  secondary: 'bg-secondary-soft text-secondary-foreground',
  info: 'bg-info/15 text-info',
};

export function StatCard({ label, value, icon: Icon, variant = 'primary', delta, hint }: Props) {
  return (
    <div className="glass rounded-2xl p-5 hover:shadow-soft transition-smooth">
      <div className="flex items-start justify-between">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', VARIANT[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        {delta && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg',
              delta.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            )}
          >
            {delta.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {delta.value}%
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-4 uppercase tracking-wider font-medium">{label}</p>
      <p className="font-display text-2xl font-semibold mt-1">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
