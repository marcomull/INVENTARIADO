import { create } from 'zustand';
import type { Product, Movement, User } from '@/types';
import { mockProducts, mockMovements, mockUsers } from './mockData';

interface DataState {
  products: Product[];
  movements: Movement[];
  users: User[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMovement: (m: Movement) => void;
  addUser: (u: User) => void;
  updateUser: (id: string, u: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  products: mockProducts,
  movements: mockMovements,
  users: mockUsers,
  addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
  updateProduct: (id, p) =>
    set((s) => ({ products: s.products.map((x) => (x.id === id ? ({ ...x, ...p } as Product) : x)) })),
  deleteProduct: (id) => set((s) => ({ products: s.products.filter((x) => x.id !== id) })),
  addMovement: (m) =>
    set((s) => {
      const products = s.products.map((p) => {
        if (p.id !== m.productId) return p;
        const delta = m.type === 'in' ? m.quantity : -m.quantity;
        return { ...p, stock: Math.max(0, p.stock + delta) } as Product;
      });
      return { movements: [m, ...s.movements], products };
    }),
  addUser: (u) => set((s) => ({ users: [u, ...s.users] })),
  updateUser: (id, u) =>
    set((s) => ({ users: s.users.map((x) => (x.id === id ? { ...x, ...u } : x)) })),
  deleteUser: (id) => set((s) => ({ users: s.users.filter((x) => x.id !== id) })),
}));
