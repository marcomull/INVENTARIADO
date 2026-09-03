import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/shared/StatCard';
import { CategoryBadge, StockBadge } from '@/components/shared/Badges';
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle, TrendingUp, ShieldCheck, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService, type Producto } from '@/services/productService';
import { Button } from '@/components/ui/button';

const PEN = (n: number) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Producto[]>([]);
  const [lowStock, setLowStock] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [prodsData, lowData] = await Promise.all([
          productService.getProducts('', 0, 100),
          productService.getLowStockAlerts(),
        ]);
        setProducts(prodsData.content || []);
        setLowStock(lowData || []);
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalProducts = products.length;
  const totalUnits = products.reduce((s, p) => s + (p.stockActual || 0), 0);
  const totalValuation = products.reduce((s, p) => s + (p.stockActual || 0) * (p.precioVenta || 0), 0);

  return (
    <div className="space-y-6">
      {/* Hero Banner Ejecutivo y Moderno */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-950 p-6 lg:p-8 text-white border border-indigo-900/40 shadow-soft overflow-hidden">
        {/* Luces sutiles de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistema de Gestión de Inventario 2026</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              {user?.role === 'admin' ? 'Panel de Control Ejecutivo' : 'Terminal de Ventas & Stock'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Supervisión de accesorios tecnológicos (carcasas, cargadores, audífonos) y productos de consumo en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/inventory">
              <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow text-sm font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Gestionar Stock
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Valor de Inventario"
          value={PEN(totalValuation)}
          icon={TrendingUp}
          variant="primary"
          hint="En precio de venta"
        />
        <StatCard
          label="Total Productos"
          value={totalProducts}
          icon={Package}
          variant="info"
          hint={`${totalUnits} unidades en almacén`}
        />
        <StatCard
          label="Stock Bajo"
          value={lowStock.length}
          icon={AlertTriangle}
          variant="accent"
          hint={lowStock.length > 0 ? "Requieren reposición" : "Inventario óptimo"}
        />
        <StatCard
          label="Estado del Sistema"
          value="100% Online"
          icon={ShieldCheck}
          variant="secondary"
          hint="MySQL & Redis sincronizados"
        />
      </div>

      {/* Grid inferior de resumen */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Catálogo de Productos */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">Productos en Inventario</h3>
              <p className="text-xs text-muted-foreground">Últimos artículos registrados en la base de datos</p>
            </div>
            <Link to="/inventory" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Ver catálogo completo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {products.slice(0, 5).map((p, i) => (
              <div key={p.idProducto} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground w-6 text-center">#{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{p.marca?.nombre || 'Genérico'}</span>
                      {p.modeloDispositivo && (
                        <span className="text-[11px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                          {p.modeloDispositivo.nombreModelo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">S/ {p.precioVenta.toFixed(2)}</p>
                  <StockBadge stock={p.stockActual} minStock={p.stockMinimo} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de Stock Bajo */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">Alertas de Stock</h3>
              <p className="text-xs text-muted-foreground">Artículos por debajo del stock mínimo</p>
            </div>
            <span className="text-xs font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-semibold">
              {lowStock.length} alertas
            </span>
          </div>

          {lowStock.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              ✅ Todos los productos cuentan con stock suficiente.
            </div>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 5).map((p) => (
                <div key={p.idProducto} className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{p.nombre}</p>
                    <p className="text-[11px] text-muted-foreground">Mínimo: {p.stockMinimo} u.</p>
                  </div>
                  <span className="text-xs font-bold text-destructive px-2 py-1 bg-destructive/10 rounded-lg shrink-0">
                    {p.stockActual} en stock
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}