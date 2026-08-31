import { cn } from '@/lib/utils';
import {
  Smartphone, BatteryCharging, Headphones, ShieldCheck, Cable, Battery,
  CupSoda, Cookie, Candy, Wheat, Package as PackageIcon,
} from 'lucide-react';

const ICONS: Record<string, typeof Smartphone> = {
  Funda: Smartphone,
  Cargador: BatteryCharging,
  Audífonos: Headphones,
  Protector: ShieldCheck,
  Cable: Cable,
  'Power Bank': Battery,
  Bebida: CupSoda,
  Snack: Wheat,
  Galleta: Cookie,
  Chocolate: Candy,
  accessory: Smartphone,
  snack: CupSoda,
};

const MAP: Record<string, string> = {
  // Categorías accesorios
  Funda: 'bg-primary-soft text-primary',
  Cargador: 'bg-accent-soft text-accent-foreground',
  Audífonos: 'bg-secondary-soft text-secondary-foreground',
  Protector: 'bg-info/15 text-info',
  Cable: 'bg-warning/20 text-warning-foreground',
  'Power Bank': 'bg-primary/15 text-primary',
  // Snacks
  Bebida: 'bg-info/15 text-info',
  Snack: 'bg-warning/20 text-warning-foreground',
  Galleta: 'bg-accent-soft text-accent-foreground',
  Chocolate: 'bg-primary-soft text-primary',
  // Tipos producto
  accessory: 'bg-primary-soft text-primary',
  snack: 'bg-secondary-soft text-secondary-foreground',
};

const LABEL: Record<string, string> = {
  accessory: 'Accesorio',
  snack: 'Bebida/Snack',
};

export function CategoryBadge({ value, withIcon = true }: { value: string; withIcon?: boolean }) {
  const cls = MAP[value] ?? 'bg-muted text-muted-foreground';
  const Icon = ICONS[value] ?? PackageIcon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium', cls)}>
      {withIcon && <Icon className="w-3 h-3" />}
      {LABEL[value] ?? value}
    </span>
  );
}

/** Ícono decorativo grande para mostrar al lado del nombre del producto en tablas (sin foto). */
export function ProductIcon({ value }: { value: string }) {
  const cls = MAP[value] ?? 'bg-muted text-muted-foreground';
  const Icon = ICONS[value] ?? PackageIcon;
  return (
    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', cls)}>
      <Icon className="w-4 h-4" />
    </div>
  );
}

export function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium',
        status === 'active' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse-soft', status === 'active' ? 'bg-success' : 'bg-muted-foreground')} />
      {status === 'active' ? 'Activo' : 'Inactivo'}
    </span>
  );
}

export function StockBadge({ stock, min }: { stock: number; min: number }) {
  let cls = 'bg-success/15 text-success';
  let label = 'En stock';
  if (stock === 0) {
    cls = 'bg-destructive/15 text-destructive';
    label = 'Agotado';
  } else if (stock <= min) {
    cls = 'bg-warning/20 text-warning-foreground';
    label = 'Stock bajo';
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium', cls)}>
      <span className="font-semibold font-mono">{stock}</span>
      <span className="opacity-70">· {label}</span>
    </span>
  );
}

export function RoleBadge({ role }: { role: 'admin' | 'staff' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium',
        role === 'admin' ? 'bg-primary-soft text-primary' : 'bg-secondary-soft text-secondary-foreground'
      )}
    >
      {role === 'admin' ? 'Administradora' : 'Personal'}
    </span>
  );
}
