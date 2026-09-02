import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, Role } from '@/types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'bloom.auth.user';
const TOKEN_KEY = 'bloom.auth.token';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
    try {
      const response = await fetch(API_URL + '/login/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email.trim(),
          contrasena: password,
        }),
      });

      if (response.status === 401) {
        return { ok: false, error: 'Credenciales inválidas. Verifica tu correo y contraseña.' };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { ok: false, error: errorData.error || 'Error al comunicarse con el servidor.' };
      }

      const data = await response.json();
      localStorage.setItem(TOKEN_KEY, data.token);

      const loggedUser: User = {
        id: String(data.id),
        name: data.correo === 'marcoarias765@gmail.com' ? 'Marco Arias' : data.correo.split('@')[0],
        email: data.correo,
        role: data.rol === 'ADMIN' ? 'admin' : 'staff',
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      setUser(loggedUser);
      return { ok: true };
    } catch (err) {
      console.error('Error de conexión:', err);
      return { ok: false, error: 'No se pudo conectar con el servidor Backend (http://localhost:8080).' };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await fetch(API_URL + '/login/logout', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
          },
        });
      } catch (e) {
        console.warn('Error al invalidar token en backend:', e);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const switchRole = (role: Role) => {
    if (user) {
      setUser({ ...user, role });
    }
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