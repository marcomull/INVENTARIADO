import type { User, Product, Movement } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Valentina Rojas', email: 'admin@bloom.pe', role: 'admin', status: 'active', phone: '+51 987 654 321', createdAt: '2024-08-12' },
  { id: 'u2', name: 'Camila Torres', email: 'camila@bloom.pe', role: 'staff', status: 'active', phone: '+51 912 345 678', createdAt: '2024-09-03' },
  { id: 'u3', name: 'Diego Quispe', email: 'diego@bloom.pe', role: 'staff', status: 'active', phone: '+51 998 112 233', createdAt: '2024-10-15' },
  { id: 'u4', name: 'Lucía Mendoza', email: 'lucia@bloom.pe', role: 'staff', status: 'inactive', phone: '+51 945 667 889', createdAt: '2024-06-21' },
];

export const mockProducts: Product[] = [
  // Accesorios
  { id: 'p1', type: 'accessory', name: 'Funda Silicona iPhone 15', category: 'Funda', brand: 'Apple', model: 'iPhone 15', stock: 24, minStock: 10, price: 65, createdAt: '2025-01-10' },
  { id: 'p2', type: 'accessory', name: 'Cargador 20W USB-C', category: 'Cargador', brand: 'Anker', model: 'PowerPort III', stock: 8, minStock: 12, price: 89, createdAt: '2025-01-12' },
  { id: 'p3', type: 'accessory', name: 'Audífonos Inalámbricos', category: 'Audífonos', brand: 'Xiaomi', model: 'Redmi Buds 5', stock: 15, minStock: 8, price: 129, createdAt: '2025-01-15' },
  { id: 'p4', type: 'accessory', name: 'Mica Vidrio Templado', category: 'Protector', brand: 'Spigen', model: 'Galaxy A54', stock: 42, minStock: 20, price: 25, createdAt: '2025-02-01' },
  { id: 'p5', type: 'accessory', name: 'Cable USB-C a Lightning', category: 'Cable', brand: 'Apple', model: 'MFI 1m', stock: 3, minStock: 10, price: 79, createdAt: '2025-02-05' },
  { id: 'p6', type: 'accessory', name: 'Power Bank 10000mAh', category: 'Power Bank', brand: 'Xiaomi', model: 'Mi PB3', stock: 11, minStock: 5, price: 99, createdAt: '2025-02-10' },
  // Bebidas y snacks
  { id: 'p7', type: 'snack', name: 'Inca Kola 500ml', subtype: 'Bebida', size: '500ml', brand: 'Inca Kola', stock: 60, minStock: 24, price: 3.5, createdAt: '2025-03-01' },
  { id: 'p8', type: 'snack', name: 'Coca Cola 1.5L', subtype: 'Bebida', size: '1.5L', brand: 'Coca Cola', stock: 18, minStock: 20, price: 7, createdAt: '2025-03-02' },
  { id: 'p9', type: 'snack', name: 'Papas Lays Clásicas', subtype: 'Snack', size: '120g', brand: 'Lays', stock: 35, minStock: 15, price: 4.5, createdAt: '2025-03-04' },
  { id: 'p10', type: 'snack', name: 'Galleta Casino Fresa', subtype: 'Galleta', size: '43g', brand: 'Nestlé', stock: 80, minStock: 30, price: 1.5, createdAt: '2025-03-05' },
  { id: 'p11', type: 'snack', name: 'Chicha Morada Gloria 1L', subtype: 'Bebida', size: '1L', brand: 'Gloria', stock: 5, minStock: 10, price: 5.5, createdAt: '2025-03-08' },
  { id: 'p12', type: 'snack', name: 'Chocolate Sublime', subtype: 'Chocolate', size: '32g', brand: 'Nestlé', stock: 50, minStock: 20, price: 2, createdAt: '2025-03-10' },
  { id: 'p13', type: 'snack', name: 'Agua San Luis 625ml', subtype: 'Bebida', size: '625ml', brand: 'San Luis', stock: 90, minStock: 40, price: 2, createdAt: '2025-03-12' },
];

export const mockMovements: Movement[] = [
  { id: 'm1', productId: 'p1', productName: 'Funda Silicona iPhone 15', type: 'out', quantity: 2, unitPrice: 65, total: 130, userId: 'u2', userName: 'Camila Torres', createdAt: '2025-04-25T10:24:00' },
  { id: 'm2', productId: 'p7', productName: 'Inca Kola 500ml', type: 'out', quantity: 5, unitPrice: 3.5, total: 17.5, userId: 'u3', userName: 'Diego Quispe', createdAt: '2025-04-25T11:10:00' },
  { id: 'm3', productId: 'p2', productName: 'Cargador 20W USB-C', type: 'in', quantity: 12, unitPrice: 60, total: 720, userId: 'u1', userName: 'Valentina Rojas', note: 'Compra a proveedor Anker Perú', createdAt: '2025-04-26T09:00:00' },
  { id: 'm4', productId: 'p9', productName: 'Papas Lays Clásicas', type: 'out', quantity: 3, unitPrice: 4.5, total: 13.5, userId: 'u2', userName: 'Camila Torres', createdAt: '2025-04-27T15:42:00' },
  { id: 'm5', productId: 'p10', productName: 'Galleta Casino Fresa', type: 'in', quantity: 50, unitPrice: 1.1, total: 55, userId: 'u1', userName: 'Valentina Rojas', createdAt: '2025-04-27T16:00:00' },
  { id: 'm6', productId: 'p3', productName: 'Audífonos Inalámbricos', type: 'out', quantity: 1, unitPrice: 129, total: 129, userId: 'u3', userName: 'Diego Quispe', createdAt: '2025-04-28T12:15:00' },
  { id: 'm7', productId: 'p13', productName: 'Agua San Luis 625ml', type: 'out', quantity: 8, unitPrice: 2, total: 16, userId: 'u2', userName: 'Camila Torres', createdAt: '2025-04-28T13:30:00' },
];
