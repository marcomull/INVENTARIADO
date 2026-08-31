import { useAuth } from '@/contexts/AuthContext';
import { Crown, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Selector flotante de demo para alternar entre Admin y Personal. */
export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  if (!user) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 glass-strong rounded-2xl p-2 shadow-soft animate-fade-in-up">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 pt-1 pb-1.5">
        Demo · Cambiar vista
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => switchRole('admin')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-smooth',
            user.role === 'admin'
              ? 'bg-gradient-primary text-primary-foreground shadow-glow'
              : 'hover:bg-muted text-muted-foreground'
          )}
        >
          <Crown className="w-3.5 h-3.5" /> Admin
        </button>
        <button
          onClick={() => switchRole('staff')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-smooth',
            user.role === 'staff'
              ? 'bg-gradient-accent text-accent-foreground shadow-soft'
              : 'hover:bg-muted text-muted-foreground'
          )}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Personal
        </button>
      </div>
    </div>
  );
}
