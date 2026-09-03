import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, LayoutDashboard, Package, ArrowLeftRight, UsersRound, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Buen día', subtitle: 'Aquí está el resumen de tu negocio.' },
  '/inventory': { title: 'Inventario', subtitle: 'Gestiona tus productos y stock disponible.' },
  '/movements': { title: 'Movimientos', subtitle: 'Ingresos, salidas y devoluciones registradas.' },
  '/staff': { title: 'Personal', subtitle: 'Crea y administra cuentas de tu equipo.' },
  '/customers': { title: 'Clientes', subtitle: 'Próximamente — gestión de clientes y fidelización.' },
};

const MOBILE_NAV = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/inventory', label: 'Stock', icon: Package },
  { to: '/movements', label: 'Movs', icon: ArrowLeftRight },
  { to: '/staff', label: 'Equipo', icon: UsersRound, adminOnly: true },
  { to: '/customers', label: 'Clientes', icon: HeartHandshake },
];

export function AppLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const meta = PAGE_TITLES[location.pathname] ?? { title: '', subtitle: '' };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  return (
    <div className="relative min-h-screen flex w-full bg-background overflow-hidden transition-colors duration-300">
      {/* Fondo decorativo mesh sutil */}
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" aria-hidden />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" aria-hidden />

      <AppSidebar />

      <div className="relative flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-background/75 border-b border-border/60 transition-colors duration-300">
          <div className="flex items-center justify-between gap-4 px-4 lg:px-8 py-4">
            <div className="min-w-0">
              <h1 className="font-display text-xl lg:text-2xl font-semibold truncate">
                {location.pathname === '/' ? `${greeting}, ${user?.name?.split(' ')[0] || 'Admin'} ✨` : meta.title}
              </h1>
              <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 truncate">{meta.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 text-sm text-muted-foreground w-64 border border-border/40">
                <Search className="w-4 h-4" />
                <span className="text-xs">Buscar en catálogo (Ctrl K)</span>
              </div>

              {/* Botón de Modo Oscuro / Claro */}
              <ThemeToggle />

              <button className="relative p-2.5 rounded-xl bg-muted/60 hover:bg-muted border border-border/40 transition-smooth" aria-label="Notificaciones">
                <Bell className="w-4 h-4 text-foreground/80" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-accent" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 pb-28 lg:pb-10 max-w-[1600px] w-full mx-auto">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>

        {/* Bottom nav móvil */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-border px-2 py-2">
          <div className="flex items-center justify-around">
            {MOBILE_NAV.filter((i) => !i.adminOnly || user?.role === 'admin').map((item) => {
              const active = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-smooth',
                    active ? 'text-primary font-semibold' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      <RoleSwitcher />
    </div>
  );
}