import { useDataStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/shared/StatCard';
import { CategoryBadge, StockBadge } from '@/components/shared/Badges';
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, Coins, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';

const PEN = (n: number) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const { user } = useAuth();
  const { products, movements } = useDataStore();

  const totalProducts = products.length;
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= p.minStock);

  const today = new Date().toDateString();
  const todayMovs = movements.filter((m) => new Date(m.createdAt).toDateString() === today);
  const todaySales = todayMovs.filter((m) => m.type === 'out').reduce((s, m) => s + m.total, 0);
  const todayIn = todayMovs.filter((m) => m.type === 'in').reduce((s, m) => s + m.total, 0);

  const inventoryValue = products.reduce((s, p) => s + p.stock * p.price, 0);

  // Top productos por movimientos (mock simple)
  const topByMov = products
    .map((p) => ({ ...p, count: movements.filter((m) => m.productId === p.id && m.type === 'out').reduce((s, m) => s + m.quantity, 0) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-[2rem] bg-gradient-primary p-7 lg:p-10 text-primary-foreground overflow-hidden shadow-pop noise">
        <div className="blob bg-white/30 w-72 h-72 -top-24 -right-20 animate-float" />
        <div className="blob bg-accent/50 w-56 h-56 -bottom-20 right-1/3 animate-float" style={{ animationDelay: '4s' }} />
        <div className="blob bg-secondary/40 w-48 h-48 top-1/3 -left-10 animate-float" style={{ animationDelay: '8s' }} />
        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] opacity-80 font-semibold">
            {user?.role === 'admin' ? 'Panel de Administración' : 'Vista de Personal'}
          </p>
          <h2 className="font-serif-display text-3xl lg:text-5xl leading-[1.1] mt-2">
            {user?.role === 'admin'
              ? <>Tu negocio <em>florece</em>, sigue brillando 🌸</>
              : <>Listas para <em>vender</em> hoy 🛍️</>}
          </h2>
          <p className="text-sm lg:text-base opacity-90 mt-3 max-w-md">
            {user?.role === 'admin'
              ? `Hoy se registraron ${todayMovs.filter((m) => m.type === 'out').length} ventas y ${lowStock.length} productos están con stock bajo.`
              : 'Recuerda revisar el stock antes de cerrar caja. ¡Ánimo!'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ventas hoy" value={PEN(todaySales)} icon={ArrowUpFromLine} variant="primary" delta={{ value: 12, positive: true }} />
        <StatCard label="Ingresos hoy" value={PEN(todayIn)} icon={ArrowDownToLine} variant="secondary" hint={`${todayMovs.filter((m) => m.type === 'in').length} entradas`} />
        <StatCard label="Productos" value={totalProducts} icon={Package} variant="info" hint={`${totalUnits} unidades en total`} />
        <StatCard label="Stock bajo" value={lowStock.length} icon={AlertTriangle} variant="accent" hint="Necesitan reabastecimiento" />
      </div>

      {/* Grid inferior */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top productos */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg">Más vendidos</h3>
              <p className="text-xs text-muted-foreground">Top productos por unidades vendidas</p>
            </div>
            <Link to="/inventory" className="text-xs font-medium text-primary hover:underline">Ver inventario →</Link>
          </div>
          <div className="space-y-3">
            {topByMov.map((p, i) => {
              const max = topByMov[0].count || 1;
              const pct = (p.count / max) * 100;
              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                      <span className="text-sm font-medium truncate">{p.name}</span>
                      <CategoryBadge value={p.type} />
                    </div>
                    <span className="text-sm font-semibold shrink-0">{p.count} u.</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock bajo */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg">Stock bajo</h3>
              <p className="text-xs text-muted-foreground">Reabastece pronto</p>
            </div>
            <Boxes className="w-5 h-5 text-warning" />
          </div>
          <div className="space-y-2.5">
            {lowStock.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">¡Todo en orden! 🎉</p>}
            {lowStock.slice(0, 6).map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-smooth">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.brand}</p>
                </div>
                <StockBadge stock={p.stock} min={p.minStock} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="glass rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-soft flex items-center justify-center">
            <Coins className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Valor total del inventario</p>
            <p className="font-display text-xl font-semibold">{PEN(inventoryValue)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
