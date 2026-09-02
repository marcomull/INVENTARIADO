const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function getAuthHeaders() {
  const token = localStorage.getItem('bloom.auth.token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
  tipoCategoria: 'TECNOLOGIA' | 'CONSUMO';
  descripcion?: string;
}

export interface Marca {
  idMarca: number;
  nombre: string;
}

export interface ModeloDispositivo {
  idModelo: number;
  nombreModelo: string;
  marca: Marca;
}

export const catalogoService = {
  async getCategorias(tipo?: string): Promise<Categoria[]> {
    const url = tipo ? `${API_URL}/catalogo/categorias?tipo=${tipo}` : `${API_URL}/catalogo/categorias`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  async getMarcas(): Promise<Marca[]> {
    const res = await fetch(`${API_URL}/catalogo/marcas`, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  async getModelos(idMarca?: number): Promise<ModeloDispositivo[]> {
    const url = idMarca ? `${API_URL}/catalogo/modelos?idMarca=${idMarca}` : `${API_URL}/catalogo/modelos`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  async createCategoria(cat: Partial<Categoria>): Promise<Categoria> {
    const res = await fetch(`${API_URL}/catalogo/categorias`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cat)
    });
    if (!res.ok) throw new Error('Error al crear categoría');
    return res.json();
  },

  async createMarca(marca: Partial<Marca>): Promise<Marca> {
    const res = await fetch(`${API_URL}/catalogo/marcas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(marca)
    });
    if (!res.ok) throw new Error('Error al crear marca');
    return res.json();
  },

  async createModelo(modelo: any): Promise<ModeloDispositivo> {
    const res = await fetch(`${API_URL}/catalogo/modelos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(modelo)
    });
    if (!res.ok) throw new Error('Error al crear modelo');
    return res.json();
  }
};