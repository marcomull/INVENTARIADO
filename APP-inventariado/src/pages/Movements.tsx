import { useState, useMemo, FormEvent } from 'react';
import { useDataStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowDownToLine, ArrowUpFromLine, Plus, Search, ArrowLeftRight } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Movements() {
  const { user } = useAuth();
  const { products, movements, addMovement } = useDataStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'in' | 'out'>('all');
  const [open, setOpen] = useState(false);

  const [type, setType] = useState<'in' | 'out'>('out');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('0');
  const [note, setNote] = useState('');

  const filtered = useMemo(() => {
    return movements.filter((m) => {
      if (typeFilter !== 'all' && m.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!`${m.productName} ${m.userName}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [movements, search, typeFilter]);

  const openNew = (t: 'in' | 'out') => {
    setType(t);
    setProductId(products[0]?.id ?? '');
    setQuantity('1');
    setUnitPrice(String(products[0]?.price ?? 0));
    setNote('');
    setOpen(true);
  };

  const handleProductChange = (id: string) => {
    setProductId(id);
    const p = products.find((x) => x.id === id);
    if (p) setUnitPrice(String(p.price));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === productId);
    if (!product || !user) return;
    const qty = Number(quantity);
    const price = Number(unitPrice);
    if (qty <= 0) { toast.error('Cantidad inválida'); return; }
    if (type === 'out' && qty > product.stock) {
      toast.error('No hay suficiente stock disponible');
      return;
    }
    addMovement({
      id: `m${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type,
      quantity: qty,
      unitPrice: price,
      total: qty * price,
      userId: user.id,
      userName: user.name,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
    toast.success(type === 'in' ? 'Ingreso registrado' : 'Venta registrada 🌸');
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar producto o responsable…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl h-10 bg-background" />
        </div>
        <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
          <SelectTrigger className="rounded-xl h-10 w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="in">Ingresos</SelectItem>
            <SelectItem value="out">Salidas/Ventas</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button onClick={() => openNew('out')} className="rounded-xl h-10 bg-gradient-primary shadow-glow">
            <ArrowUpFromLine className="w-4 h-4 mr-1" /> Registrar venta
          </Button>
          <Button onClick={() => openNew('in')} variant="outline" className="rounded-xl h-10">
            <ArrowDownToLine className="w-4 h-4 mr-1" /> Ingreso
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={ArrowLeftRight} title="Sin movimientos" description="Aún no se registran movimientos con esos filtros." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <th className="text-left font-medium px-5 py-3">Tipo</th>
                  <th className="text-left font-medium px-5 py-3">Producto</th>
                  <th className="text-left font-medium px-5 py-3">Responsable</th>
                  <th className="text-right font-medium px-5 py-3">Cantidad</th>
                  <th className="text-right font-medium px-5 py-3">Total</th>
                  <th className="text-right font-medium px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/30 transition-smooth">
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium',
                        m.type === 'in' ? 'bg-secondary-soft text-secondary-foreground' : 'bg-primary-soft text-primary'
                      )}>
                        {m.type === 'in' ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}
                        {m.type === 'in' ? 'Ingreso' : 'Venta'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{m.productName}</p>
                      {m.note && <p className="text-[11px] text-muted-foreground italic">"{m.note}"</p>}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{m.userName}</td>
                    <td className="px-5 py-3.5 text-right font-mono">{m.quantity}</td>
                    <td className="px-5 py-3.5 text-right font-medium font-mono">S/ {m.total.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">
                      {new Date(m.createdAt).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{type === 'in' ? 'Registrar ingreso' : 'Registrar venta'}</DialogTitle>
            <DialogDescription>{type === 'in' ? 'Suma stock al inventario.' : 'Resta stock por una venta o salida.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl">
              <button type="button" onClick={() => setType('out')} className={cn('text-sm py-2 rounded-lg font-medium transition-smooth', type === 'out' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground')}>Venta/Salida</button>
              <button type="button" onClick={() => setType('in')} className={cn('text-sm py-2 rounded-lg font-medium transition-smooth', type === 'in' ? 'bg-card shadow-sm text-secondary-foreground' : 'text-muted-foreground')}>Ingreso</button>
            </div>

            <div className="space-y-1.5">
              <Label>Producto</Label>
              <Select value={productId} onValueChange={handleProductChange}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} <span className="text-muted-foreground text-xs">· {p.stock} u.</span></SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Cantidad</Label>
                <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label>Precio unitario (S/)</Label>
                <Input type="number" min={0} step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Nota (opcional)</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="rounded-xl resize-none" placeholder="ej. Cliente frecuente, proveedor X…" />
            </div>

            <div className="rounded-xl bg-muted/40 p-3 flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-display font-semibold">S/ {(Number(quantity) * Number(unitPrice)).toFixed(2)}</span>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancelar</Button>
              <Button type="submit" className="rounded-xl bg-gradient-primary shadow-glow">Registrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
