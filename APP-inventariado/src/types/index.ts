export type Role = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  phone?: string;
  createdAt: string;
}

export type ProductCategory = 'accessory' | 'snack';

export interface AccessoryProduct {
  id: string;
  type: 'accessory';
  name: string;
  category: string; // ej: Funda, Cargador, Audífonos
  brand: string;
  model: string;
  stock: number;
  minStock: number;
  price: number;
  createdAt: string;
}

export interface SnackProduct {
  id: string;
  type: 'snack';
  name: string;
  subtype: string; // Bebida, Snack, Galleta, etc.
  size: string; // 500ml, 100g
  brand: string;
  stock: number;
  minStock: number;
  price: number;
  createdAt: string;
}

export type Product = AccessoryProduct | SnackProduct;

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  unitPrice: number;
  total: number;
  userId: string;
  userName: string;
  note?: string;
  createdAt: string;
}
