const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getAuthHeaders() {
  const token = localStorage.getItem('bloom.auth.token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export interface DevolucionDTO {
  idVenta: number;
  idProducto: number;
  idUsuario: number;
  cantidad: number;
  motivoDevolucion: 'DEFECTO_FABRICA' | 'CAMBIO_MODELO' | 'PRODUCTO_VENCIDO' | 'OTRO';
  destinoProducto: 'RETORNA_A_STOCK' | 'DESCARTE_MERMA' | 'DEVOLUCION_A_PROVEEDOR';
  observaciones?: string;
}

export const devolucionService = {
  async getDevoluciones(page = 0, size = 20) {
    const res = await fetch(`${API_URL}/devoluciones?page=${page}&size=${size}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Error al listar devoluciones');
    return res.json();
  },

  async create(dto: DevolucionDTO) {
    const res = await fetch(`${API_URL}/devoluciones`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dto)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al procesar devolución');
    }
    return res.json();
  }
};