const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getAuthHeaders() {
  const token = localStorage.getItem('bloom.auth.token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export interface Producto {
  idProducto: number;
  codigoBarras: string;
  nombre: string;
  categoria: {
    idCategoria: number;
    nombre: string;
    tipoCategoria: 'TECNOLOGIA' | 'CONSUMO';
    descripcion?: string;
  };
  marca?: {
    idMarca: number;
    nombre: string;
  };
  modeloDispositivo?: {
    idModelo: number;
    nombreModelo: string;
  };
  caracteristicas?: string;
  color?: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  imagenUrl?: string;
  activo: boolean;
  fechaCreacion?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const productService = {
  async getProducts(q?: string, page = 0, size = 20): Promise<PageResponse<Producto>> {
    const params = new URLSearchParams();
    if (q && q.trim()) params.append('q', q.trim());
    params.append('page', String(page));
    params.append('size', String(size));

    const res = await fetch(`${API_URL}/productos?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al cargar productos');
    return res.json();
  },

  async getSuggestions(query: string): Promise<Producto[]> {
    if (!query || !query.trim()) return [];
    const res = await fetch(`${API_URL}/productos/sugerencias?q=${encodeURIComponent(query.trim())}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getById(id: number): Promise<Producto> {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Producto no encontrado');
    return res.json();
  },

  async create(data: Partial<Producto> & { idCategoria: number; idMarca?: number; idModeloDispositivo?: number; codigoLote?: string; fechaVencimiento?: string }): Promise<Producto> {
    const userRaw = localStorage.getItem('bloom.auth.user');
    let userId = 1;
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        if (u.id) userId = Number(u.id);
      } catch (e) {}
    }

    const res = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'X-User-Id': String(userId)
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear producto');
    }
    return res.json();
  },

  async update(id: number, data: any): Promise<Producto> {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
  },

  async getLowStockAlerts(): Promise<Producto[]> {
    const res = await fetch(`${API_URL}/productos/alertas/stock-bajo`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getExpiryAlerts(days = 30): Promise<any[]> {
    const res = await fetch(`${API_URL}/productos/alertas/vencimientos?dias=${days}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    return res.json();
  }
};