import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Role } from '@/types';
import { mockUsers } from '@/lib/mockData';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  /** Helper de demo: cambia rápidamente entre Admin y Personal */
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'bloom.auth.user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login: AuthContextValue['login'] = async (email, password) => {
    // Mock: cualquier password >= 4 caracteres si el email existe
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { ok: false, error: 'No existe una cuenta con ese correo.' };
    if (found.status === 'inactive') return { ok: false, error: 'Tu cuenta está desactivada. Contacta al administrador.' };
    if (password.length < 4) return { ok: false, error: 'Contraseña incorrecta.' };
    setUser(found);
    return { ok: true };
  };

  const logout = () => setUser(null);

  const switchRole = (role: Role) => {
    const target = mockUsers.find((u) => u.role === role && u.status === 'active');
    if (target) setUser(target);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
