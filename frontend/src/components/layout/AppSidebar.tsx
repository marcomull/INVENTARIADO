import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowLeftRight, UsersRound, HeartHandshake, Boxes, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
  comingSoon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
  { to: '/inventory', label: 'Inventario', icon: Package, roles: ['admin', 'staff'] },
  { to: '/movements', label: 'Movimientos', icon: ArrowLeftRight, roles: ['admin', 'staff'] },
  { to: '/staff', label: 'Personal', icon: UsersRound, roles: ['admin'] },
  { to: '/customers', label: 'Clientes', icon: HeartHandshake, roles: ['admin', 'staff'], comingSoon: true },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;
  const visibleItems = NAV_ITEMS.filter((i) => i.roles.includes(user.role));

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar h-screen sticky top-0 transition-colors duration-300">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow text-primary-foreground">
          <Boxes className="w-5 h-5" />
        </div>
        <div>
          <p className="font-display font-bold leading-none text-foreground text-base">Inventario Pro</p>
          <p className="text-[11px] text-muted-foreground mt-1">Gestión & Ventas</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2">Menú Principal</p>
        {visibleItems.map((item) => {
          const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.comingSoon ? '#' : item.to}
              onClick={(e) => item.comingSoon && e.preventDefault()}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group relative',
                active
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                item.comingSoon && 'cursor-not-allowed opacity-60 hover:opacity-80'
              )}
            >
              <Icon className={cn('w-4 h-4', active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              <span className="flex-1">{item.label}</span>
              {item.comingSoon && (
                <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                  Pronto
                </span>
              )}
              {active && <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/40 border border-border/40">
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
            {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {user.role === 'admin' ? 'Administrador' : 'Personal'}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}