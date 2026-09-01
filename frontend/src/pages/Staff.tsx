import { useState, useMemo, FormEvent } from 'react';
import { useDataStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Pencil, Trash2, UsersRound, Mail, Phone } from 'lucide-react';
import { RoleBadge, StatusBadge } from '@/components/shared/Badges';
import { EmptyState } from '@/components/shared/EmptyState';
import type { User, Role } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Form {
  name: string; email: string; phone: string; role: Role; status: 'active' | 'inactive'; password: string;
}
const EMPTY: Form = { name: '', email: '', phone: '', role: 'staff', status: 'active', password: '' };

export default function Staff() {
  const { user: current } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useDataStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  const filtered = useMemo(() => users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!`${u.name} ${u.email}`.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [users, search, roleFilter, statusFilter]);

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ name: u.name, email: u.email, phone: u.phone ?? '', role: u.role, status: u.status, password: '' }); setOpen(true); };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { toast.error('Completa nombre y correo'); return; }
    if (!editing && form.password.length < 4) { toast.error('La contraseña debe tener al menos 4 caracteres'); return; }
    if (editing) {
      updateUser(editing.id, { name: form.name, email: form.email, phone: form.phone, role: form.role, status: form.status });
      toast.success('Cuenta actualizada');
    } else {
      addUser({ id: `u${Date.now()}`, name: form.name, email: form.email, phone: form.phone, role: form.role, status: form.status, createdAt: new Date().toISOString() });
      toast.success('Cuenta creada con éxito 🌸');
    }
    setOpen(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    deleteUser(confirmDelete.id);
    toast.success('Cuenta eliminada');
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o correo…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl h-10 bg-background" />
        </div>
        <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
          <SelectTrigger className="rounded-xl h-10 w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="staff">Personal</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <SelectTrigger className="rounded-xl h-10 w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openNew} className="rounded-xl h-10 bg-gradient-primary shadow-glow">
          <Plus className="w-4 h-4 mr-1" /> Crear cuenta
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl">
          <EmptyState icon={UsersRound} title="Sin resultados" description="No encontramos personal con esos filtros." />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u) => (
            <div key={u.id} className="glass rounded-2xl p-5 hover:shadow-soft transition-smooth group">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                  {u.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{u.name}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <RoleBadge role={u.role} />
                    <StatusBadge status={u.status} />
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                  <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-smooth" aria-label="Editar"><Pencil className="w-3.5 h-3.5" /></button>
                  {u.id !== current?.id && (
                    <button onClick={() => setConfirmDelete(u)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-smooth" aria-label="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {u.email}</p>
                {u.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {u.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? 'Editar cuenta' : 'Crear cuenta de personal'}</DialogTitle>
            <DialogDescription>{editing ? 'Actualiza los datos de esta persona.' : 'Solo el administrador puede crear cuentas nuevas.'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" placeholder="+51 9XX XXX XXX" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Rol</Label>
                <Select value={form.role} onValueChange={(v: Role) => setForm({ ...form, role: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Personal</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <div className="flex items-center gap-3 h-10 px-3 rounded-xl border border-input">
                  <Switch checked={form.status === 'active'} onCheckedChange={(v) => setForm({ ...form, status: v ? 'active' : 'inactive' })} />
                  <span className="text-sm">{form.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                </div>
              </div>
            </div>
            {!editing && (
              <div className="space-y-1.5">
                <Label>Contraseña inicial</Label>
                <Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-xl" placeholder="Mínimo 4 caracteres" />
                <p className="text-[11px] text-muted-foreground">La compartirás con esta persona para su primer ingreso.</p>
              </div>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancelar</Button>
              <Button type="submit" className="rounded-xl bg-gradient-primary shadow-glow">{editing ? 'Guardar cambios' : 'Crear cuenta'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar a {confirmDelete?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción es permanente. La persona ya no podrá iniciar sesión.</AlertDialogDescription>
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
