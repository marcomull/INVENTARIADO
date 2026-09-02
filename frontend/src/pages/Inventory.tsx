import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryBadge, StockBadge, ProductIcon } from '@/components/shared/Badges';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Pencil, Trash2, Package, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { productService, type Producto } from '@/services/productService';
import { catalogoService, type Categoria, type Marca, type ModeloDispositivo } from '@/services/catalogoService';
import { toast } from 'sonner';

interface FormState {
  idCategoria: number | '';
  nombre: string;
  idMarca: number | '';
  idModeloDispositivo: number | '';
  caracteristicas: string;
  color: string;
  precioCompra: string;
  precioVenta: string;
  stockActual: string;
  stockMinimo: string;
  codigoBarras: string;
  codigoLote: string;
  fechaVencimiento: string;
}

const EMPTY_FORM: FormState = {
  idCategoria: '',
  nombre: '',
  idMarca: '',
  idModeloDispositivo: '',
  caracteristicas: '',
  color: '',
  precioCompra: '0',
  precioVenta: '0',
  stockActual: '0',
  stockMinimo: '5',
  codigoBarras: '',
  codigoLote: '',
  fechaVencimiento: '',
};

export default function Inventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<ModeloDispositivo[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Producto[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [typeFilter, setTypeFilter] = useState<'all' | 'TECNOLOGIA' | 'CONSUMO'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'low' | 'out'>('all');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Producto | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData, marcasData, modelosData] = await Promise.all([
        productService.getProducts(),
        catalogoService.getCategorias(),
        catalogoService.getMarcas(),
        catalogoService.getModelos(),
      ]);
      setProducts(prodsData.content || []);
      setCategories(catsData || []);
      setMarcas(marcasData || []);
      setModelos(modelosData || []);
    } catch (err: any) {
      console.error('Error al cargar inventario:', err);
      toast.error('No se pudo conectar con el catálogo de productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Algoritmo Trie de Autocompletado en tiempo real
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await productService.getSuggestions(search);
        setSuggestions(res.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [search]);

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.idCategoria === Number(form.idCategoria));
  }, [categories, form.idCategoria]);

  const filteredModelos = useMemo(() => {
    if (!form.idMarca) return modelos;
    return modelos.filter((m) => m.marca?.idMarca === Number(form.idMarca));
  }, [modelos, form.idMarca]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (typeFilter !== 'all' && p.categoria?.tipoCategoria !== typeFilter) return false;
      if (stockFilter === 'in' && p.stockActual <= p.stockMinimo) return false;
      if (stockFilter === 'low' && (p.stockActual === 0 || p.stockActual > p.stockMinimo)) return false;
      if (stockFilter === 'out' && p.stockActual !== 0) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = [
          p.nombre,
          p.codigoBarras,
          p.marca?.nombre,
          p.modeloDispositivo?.nombreModelo,
          p.categoria?.nombre,
          p.caracteristicas,
          p.color,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, search, typeFilter, stockFilter]);

  const openNew = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      idCategoria: categories.length > 0 ? categories[0].idCategoria : '',
      idMarca: marcas.length > 0 ? marcas[0].idMarca : '',
    });
    setOpen(true);
  };

  const openEdit = (p: Producto) => {
    setEditing(p);
    setForm({
      idCategoria: p.categoria?.idCategoria || '',
      nombre: p.nombre,
      idMarca: p.marca?.idMarca || '',
      idModeloDispositivo: p.modeloDispositivo?.idModelo || '',
      caracteristicas: p.caracteristicas || '',
      color: p.color || '',
      precioCompra: String(p.precioCompra),
      precioVenta: String(p.precioVenta),
      stockActual: String(p.stockActual),
      stockMinimo: String(p.stockMinimo),
      codigoBarras: p.codigoBarras || '',
      codigoLote: '',
      fechaVencimiento: '',
    });
    setOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.idCategoria) {
      toast.error('Completa el nombre y selecciona la categoría');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await productService.update(editing.idProducto, {
          idCategoria: Number(form.idCategoria),
          idMarca: form.idMarca ? Number(form.idMarca) : null,
          idModeloDispositivo: form.idModeloDispositivo ? Number(form.idModeloDispositivo) : null,
          nombre: form.nombre.trim(),
          caracteristicas: form.caracteristicas.trim(),
          color: form.color.trim(),
          precioCompra: Number(form.precioCompra) || 0,
          precioVenta: Number(form.precioVenta) || 0,
          stockMinimo: Number(form.stockMinimo) || 5,
          codigoBarras: form.codigoBarras.trim() || undefined,
        });
        toast.success('Producto actualizado con éxito');
      } else {
        await productService.create({
          idCategoria: Number(form.idCategoria),
          idMarca: form.idMarca ? Number(form.idMarca) : undefined,
          idModeloDispositivo: form.idModeloDispositivo ? Number(form.idModeloDispositivo) : undefined,
          nombre: form.nombre.trim(),
          caracteristicas: form.caracteristicas.trim(),
          color: form.color.trim(),
          precioCompra: Number(form.precioCompra) || 0,
          precioVenta: Number(form.precioVenta) || 0,
          stockActual: Number(form.stockActual) || 0,
          stockMinimo: Number(form.stockMinimo) || 5,
          codigoBarras: form.codigoBarras.trim() || undefined,
          codigoLote: form.codigoLote.trim() || undefined,
          fechaVencimiento: form.fechaVencimiento || undefined,
        });
        toast.success('Producto creado e indexado en el árbol Trie');
      }
      setOpen(false);
      await loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await productService.delete(confirmDelete.idProducto);
      toast.success(`Producto "${confirmDelete.nombre}" eliminado`);
      setConfirmDelete(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar producto');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Inventario de Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión híbrida: accesorios tecnológicos (por marca/modelo/anillo) y productos de consumo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="rounded-xl">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          {user?.role === 'admin' && (
            <Button onClick={openNew} className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          )}
        </div>
      </div>

      {/* Barra de Filtros & Búsqueda con Árbol Trie */}
      <div className="bg-card/70 backdrop-blur border border-border/80 rounded-2xl p-4 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Input con Autocompletado Trie */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, modelo (iPhone 15), marca, o característica (con argolla)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
              className="pl-9 pr-8 rounded-xl h-10 bg-background/60"
            />
            {search && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-medium">
                🌳 Trie
              </span>
            )}

            {/* Sugerencias del Árbol Trie */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-popover/95 backdrop-blur-md border border-border/80 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground flex items-center gap-1 border-b border-border/50 bg-muted/40">
                  <Sparkles className="w-3 h-3 text-primary" /> Sugerencias instantáneas (Árbol de Prefijos)
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s.idProducto}
                    type="button"
                    onClick={() => {
                      setSearch(s.nombre);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-primary/10 flex items-center justify-between transition-colors border-b border-border/30 last:border-0"
                  >
                    <div>
                      <span className="font-medium text-foreground">{s.nombre}</span>
                      {s.modeloDispositivo && (
                        <span className="ml-2 text-muted-foreground text-[11px]">({s.modeloDispositivo.nombreModelo})</span>
                      )}
                    </div>
                    <span className="text-primary font-semibold">S/ {s.precioVenta.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filtro de Tipo */}
          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger className="w-full md:w-48 rounded-xl h-10">
              <SelectValue placeholder="Tipo de Producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Tipos</SelectItem>
              <SelectItem value="TECNOLOGIA">📱 Tecnología</SelectItem>
              <SelectItem value="CONSUMO">🥤 Consumo</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro de Stock */}
          <Select value={stockFilter} onValueChange={(v: any) => setStockFilter(v)}>
            <SelectTrigger className="w-full md:w-44 rounded-xl h-10">
              <SelectValue placeholder="Nivel de Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el Stock</SelectItem>
              <SelectItem value="in">Normal</SelectItem>
              <SelectItem value="low">Stock Bajo</SelectItem>
              <SelectItem value="out">Agotado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla de Productos */}
      {loading ? (
        <div className="p-12 text-center bg-card rounded-2xl border border-border/60">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground mt-3">Cargando inventario desde base de datos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No se encontraron productos"
          description={search ? `No hay resultados para "${search}".` : 'No hay productos registrados en esta sección.'}
          action={
            user?.role === 'admin' ? (
              <Button onClick={openNew} size="sm" className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Agregar primer producto
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-card/80 backdrop-blur border border-border/80 rounded-2xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground font-medium uppercase tracking-wider border-b border-border/60">
                <tr>
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-left">Marca / Modelo</th>
                  <th className="px-4 py-3 text-right">Precio Venta</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-left">Detalles / Características</th>
                  {user?.role === 'admin' && <th className="px-4 py-3 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((p) => {
                  const isLow = p.stockActual <= p.stockMinimo;
                  const isOut = p.stockActual === 0;

                  return (
                    <tr key={p.idProducto} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <ProductIcon type={p.categoria?.tipoCategoria === 'CONSUMO' ? 'snack' : 'accessory'} />
                          <div>
                            <p className="font-medium text-foreground">{p.nombre}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {p.codigoBarras || `SKU-${String(p.idProducto).padStart(4, '0')}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <CategoryBadge category={p.categoria?.nombre || 'General'} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-xs">
                          <p className="font-medium text-foreground">{p.marca?.nombre || '-'}</p>
                          {p.modeloDispositivo && (
                            <p className="text-muted-foreground">{p.modeloDispositivo.nombreModelo}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-foreground">
                        S/ {p.precioVenta.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <StockBadge stock={p.stockActual} minStock={p.stockMinimo} />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-xs truncate">
                        {p.caracteristicas || p.color ? (
                          <span>
                            {p.color && <span className="font-medium text-foreground mr-1">[{p.color}]</span>}
                            {p.caracteristicas}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:text-primary"
                              onClick={() => openEdit(p)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:text-destructive text-muted-foreground"
                              onClick={() => setConfirmDelete(p)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Producto */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-semibold">
              {editing ? 'Editar Producto' : 'Registrar Nuevo Producto'}
            </DialogTitle>
            <DialogDescription>
              Configura los detalles del producto, modelo compatible y características especiales.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Categoría */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Categoría *</Label>
                <Select
                  value={String(form.idCategoria)}
                  onValueChange={(v) => setForm({ ...form, idCategoria: Number(v) })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.idCategoria} value={String(c.idCategoria)}>
                        {c.tipoCategoria === 'TECNOLOGIA' ? '📱 ' : '🥤 '} {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Marca */}
              <div className="space-y-1.5">
                <Label>Marca</Label>
                <Select
                  value={String(form.idMarca)}
                  onValueChange={(v) => setForm({ ...form, idMarca: Number(v), idModeloDispositivo: '' })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecciona marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {marcas.map((m) => (
                      <SelectItem key={m.idMarca} value={String(m.idMarca)}>
                        {m.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nombre del Producto */}
            <div className="space-y-1.5">
              <Label>Nombre del Producto *</Label>
              <Input
                placeholder="Ej: Funda MagSafe de Cuero con Anillo Giratorio"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>

            {/* Modelo de Celular si es Tecnología */}
            {selectedCategory?.tipoCategoria === 'TECNOLOGIA' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Modelo de Dispositivo Compatible</Label>
                  <Select
                    value={String(form.idModeloDispositivo)}
                    onValueChange={(v) => setForm({ ...form, idModeloDispositivo: Number(v) })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Ej: iPhone 15 Pro Max" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredModelos.map((m) => (
                        <SelectItem key={m.idModelo} value={String(m.idModelo)}>
                          {m.nombreModelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Color / Acabado</Label>
                  <Input
                    placeholder="Ej: Negro Mate / Transparente"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Características Especiales (Argolla, Tipo C, etc.) */}
            <div className="space-y-1.5">
              <Label>Características Especiales (Búsqueda inteligente)</Label>
              <Input
                placeholder="Ej: Argolla magnética 360°, Carga Rápida 20W, Silicona antigolpes"
                value={form.caracteristicas}
                onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })}
                className="rounded-xl"
              />
            </div>

            {/* Precios y Stock */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label>Precio Compra</Label>
                <Input
                  type="number"
                  step="0.10"
                  value={form.precioCompra}
                  onChange={(e) => setForm({ ...form, precioCompra: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Precio Venta *</Label>
                <Input
                  type="number"
                  step="0.10"
                  value={form.precioVenta}
                  onChange={(e) => setForm({ ...form, precioVenta: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Stock Inicial</Label>
                <Input
                  type="number"
                  disabled={!!editing}
                  value={form.stockActual}
                  onChange={(e) => setForm({ ...form, stockActual: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Stock Mínimo</Label>
                <Input
                  type="number"
                  value={form.stockMinimo}
                  onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Fechas de Vencimiento para Productos de Consumo */}
            {selectedCategory?.tipoCategoria === 'CONSUMO' && !editing && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  ⚠️ Control de Vencimiento para Consumo (Gaseosas / Snacks)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Código de Lote</Label>
                    <Input
                      placeholder="LOT-2026-01"
                      value={form.codigoLote}
                      onChange={(e) => setForm({ ...form, codigoLote: e.target.value })}
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Fecha de Vencimiento</Label>
                    <Input
                      type="date"
                      value={form.fechaVencimiento}
                      onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })}
                      className="rounded-xl h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="rounded-xl bg-gradient-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editing ? 'Guardar Cambios' : 'Registrar Producto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmar Eliminación */}
      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Dar de baja este producto?</AlertDialogTitle>
            <AlertDialogDescription>
              El producto &quot;{confirmDelete?.nombre}&quot; se marcará como inactivo y no aparecerá en las búsquedas ni ventas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive hover:bg-destructive/90">
              Dar de baja
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}