import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowLeftRight, UsersRound, HeartHandshake, Sparkles, LogOut } from 'lucide-react';
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
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar h-screen sticky top-0">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-display font-bold leading-none">Bloom</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Inventario & Ventas</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2">Menú</p>
        {visibleItems.map((item) => {
          const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.comingSoon ? '#' : item.to}
              onClick={(e) => item.comingSoon && e.preventDefault()}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth group relative',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
                item.comingSoon && 'cursor-not-allowed opacity-70 hover:opacity-100'
              )}
            >
              <Icon className={cn('w-4 h-4', active && 'text-primary')} />
              <span className="flex-1">{item.label}</span>
              {item.comingSoon && (
                <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-accent/20 text-accent-foreground font-semibold">
                  Pronto
                </span>
              )}
              {active && <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-primary rounded-r-full" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/40">
          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold shrink-0">
            {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {user.role === 'admin' ? 'Administrador' : 'Personal'}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-smooth"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
