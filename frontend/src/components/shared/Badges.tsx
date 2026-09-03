import { cn } from '@/lib/utils';
import {
  Smartphone, BatteryCharging, Headphones, ShieldCheck, Cable, Battery,
  CupSoda, Cookie, Candy, Wheat, Package as PackageIcon, ShieldAlert, UserCheck
} from 'lucide-react';
import type { Role } from '@/types';

const ICONS: Record<string, typeof Smartphone> = {
  Funda: Smartphone,
  Cargador: BatteryCharging,
  'Audífonos': Headphones,
  Audifonos: Headphones,
  Protector: ShieldCheck,
  Cable: Cable,
  'Power Bank': Battery,
  Bebida: CupSoda,
  Snack: Wheat,
  Galleta: Cookie,
  Chocolate: Candy,
  accessory: Smartphone,
  snack: CupSoda,
  TECNOLOGIA: Smartphone,
  CONSUMO: CupSoda,
};

const MAP: Record<string, string> = {
  // Categorías accesorios
  'Carcasas y Fundas': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  'Cargadores y Cables': 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
  'Audífonos': 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
  Funda: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  Cargador: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
  Protector: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  Cable: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  'Power Bank': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  // Snacks y Consumo
  'Bebidas y Gaseosas': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
  'Snacks y Galletas': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  Bebida: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
  Snack: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  Galleta: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
  Chocolate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  // Tipos de producto
  TECNOLOGIA: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  CONSUMO: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  accessory: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  snack: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
};

export function CategoryBadge({ category, value, withIcon = true }: { category?: string; value?: string; withIcon?: boolean }) {
  const catName = category || value || 'General';
  const cls = MAP[catName] ?? 'bg-muted text-muted-foreground border border-border/40';
  const Icon = ICONS[catName] ?? PackageIcon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium', cls)}>
      {withIcon && <Icon className="w-3.5 h-3.5" />}
      {catName}
    </span>
  );
}

export function StockBadge({ stock, minStock = 5 }: { stock: number; minStock?: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
        Agotado (0 u.)
      </span>
    );
  }
  if (stock <= minStock) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        Stock bajo ({stock} u.)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
      {stock} u.
    </span>
  );
}

export function ProductIcon({ type, value }: { type?: 'accessory' | 'snack' | 'TECNOLOGIA' | 'CONSUMO'; value?: string }) {
  const isConsumo = type === 'snack' || type === 'CONSUMO' || value === 'snack';
  const Icon = isConsumo ? CupSoda : Smartphone;
  const cls = isConsumo
    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';

  return (
    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', cls)}>
      <Icon className="w-4 h-4" />
    </div>
  );
}

export function RoleBadge({ role }: { role: Role | string }) {
  const isAdmin = role === 'admin' || role === 'ADMIN';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold',
        isAdmin
          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
          : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
      )}
    >
      {isAdmin ? <ShieldAlert className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
      {isAdmin ? 'Administrador' : 'Personal'}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'active' | 'inactive' | string }) {
  const isActive = status === 'active' || status === 'ACTIVO' || status === 'true';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold',
        isActive
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
          : 'bg-muted text-muted-foreground border border-border/40'
      )}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}