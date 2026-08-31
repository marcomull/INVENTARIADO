import { useState, useMemo, FormEvent } from 'react';
import { useDataStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryBadge, StockBadge, ProductIcon } from '@/components/shared/Badges';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Pencil, Trash2, Package, SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/types';
import { toast } from 'sonner';

const ACCESSORY_CATEGORIES = ['Funda', 'Cargador', 'Audífonos', 'Protector', 'Cable', 'Power Bank'];
const SNACK_TYPES = ['Bebida', 'Snack', 'Galleta', 'Chocolate'];

interface FormState {
  type: 'accessory' | 'snack';
  name: string;
  brand: string;
  // accessory
  category: string;
  model: string;
  // snack
  subtype: string;
  size: string;
  // shared
  stock: string;
  minStock: string;
  price: string;
}

const EMPTY_FORM: FormState = {
  type: 'accessory', name: '', brand: '', category: ACCESSORY_CATEGORIES[0],
  model: '', subtype: SNACK_TYPES[0], size: '', stock: '0', minStock: '5', price: '0',
};

export default function Inventory() {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useDataStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'accessory' | 'snack'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'low' | 'out'>('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (stockFilter === 'in' && p.stock <= p.minStock) return false;
      if (stockFilter === 'low' && (p.stock === 0 || p.stock > p.minStock)) return false;
      if (stockFilter === 'out' && p.stock !== 0) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [p.name, p.brand, (p as any).category, (p as any).model, (p as any).subtype].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, search, typeFilter, stockFilter]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      type: p.type,
      name: p.name,
      brand: p.brand,
      category: p.type === 'accessory' ? p.category : ACCESSORY_CATEGORIES[0],
      model: p.type === 'accessory' ? p.model : '',
      subtype: p.type === 'snack' ? p.subtype : SNACK_TYPES[0],
      size: p.type === 'snack' ? p.size : '',
      stock: String(p.stock),
      minStock: String(p.minStock),
      price: String(p.price),
    });
    setOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const base = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
      price: Number(form.price) || 0,
    };
    if (!base.name || !base.brand) {
      toast.error('Completa nombre y marca');
      return;
    }
    const product: Product = form.type === 'accessory'
      ? { id: editing?.id ?? `p${Date.now()}`, type: 'accessory', ...base, category: form.category, model: form.model.trim(), createdAt: editing?.createdAt ?? new Date().toISOString() }
      : { id: editing?.id ?? `p${Date.now()}`, type: 'snack', ...base, subtype: form.subtype, size: form.size.trim(), createdAt: editing?.createdAt ?? new Date().toISOString() };

    if (editing) {
      updateProduct(editing.id, product);
      toast.success('Producto actualizado');
    } else {
      addProduct(product);
      toast.success('Producto creado');
    }
    setOpen(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteProduct(confirmDelete.id);
    toast.success('Producto eliminado');
    setConfirmDelete(null);
  };

  const canEdit = user?.role === 'admin';

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, marca, modelo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl h-10 bg-background"
          />
        </div>
        <div className="flex gap-2 items-center">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground hidden lg:block" />
          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger className="rounded-xl h-10 w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorías</SelectItem>
              <SelectItem value="accessory">Accesorios</SelectItem>
              <SelectItem value="snack">Bebidas/Snacks</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={(v: any) => setStockFilter(v)}>
            <SelectTrigger className="rounded-xl h-10 w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el stock</SelectItem>
              <SelectItem value="in">En stock</SelectItem>
              <SelectItem value="low">Stock bajo</SelectItem>
              <SelectItem value="out">Agotado</SelectItem>
            </SelectContent>
          </Select>
          {canEdit && (
            <Button onClick={openNew} className="rounded-xl h-10 bg-gradient-primary shadow-glow">
              <Plus className="w-4 h-4 mr-1" /> Nuevo producto
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Package} title="Sin productos" description="No encontramos productos con esos filtros." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <th className="text-left font-medium px-5 py-3">Producto</th>
                  <th className="text-left font-medium px-5 py-3">Categoría</th>
                  <th className="text-left font-medium px-5 py-3">Detalle</th>
                  <th className="text-left font-medium px-5 py-3">Stock</th>
                  <th className="text-right font-medium px-5 py-3">Precio</th>
                  {canEdit && <th className="text-right font-medium px-5 py-3 w-24">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-smooth">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <ProductIcon value={p.type === 'accessory' ? p.category : p.subtype} />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <CategoryBadge value={p.type === 'accessory' ? p.category : p.subtype} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {p.type === 'accessory' ? p.model : p.size}
                    </td>
                    <td className="px-5 py-3.5">
                      <StockBadge stock={p.stock} min={p.minStock} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium font-mono">
                      S/ {p.price.toFixed(2)}
                    </td>
                    {canEdit && (
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-smooth" aria-label="Editar">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setConfirmDelete(p)} className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-smooth" aria-label="Eliminar">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
          Mostrando {filtered.length} de {products.length} productos
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
            <DialogDescription>Completa los datos del producto.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl">
              {(['accessory', 'snack'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={!!editing}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`text-sm py-2 rounded-lg font-medium transition-smooth ${form.type === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'} ${editing ? 'opacity-60' : ''}`}
                >
                  {t === 'accessory' ? '📱 Accesorio' : '🥤 Bebida/Snack'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label>Nombre</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label>Marca</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="rounded-xl" required />
              </div>

              {form.type === 'accessory' ? (
                <>
                  <div className="space-y-1.5">
                    <Label>Categoría</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ACCESSORY_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Modelo / Compatibilidad</Label>
                    <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="ej. iPhone 15 Pro" className="rounded-xl" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label>Tipo</Label>
                    <Select value={form.subtype} onValueChange={(v) => setForm({ ...form, subtype: v })}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SNACK_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Litraje / Peso</Label>
                    <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="ej. 500ml, 100g" className="rounded-xl" />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label>Stock</Label>
                <Input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Stock mínimo</Label>
                <Input type="number" min={0} value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} className="rounded-xl" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Precio (S/)</Label>
                <Input type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl" />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancelar</Button>
              <Button type="submit" className="rounded-xl bg-gradient-primary shadow-glow">{editing ? 'Guardar cambios' : 'Crear producto'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará <span className="font-medium text-foreground">{confirmDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
