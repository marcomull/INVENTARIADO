import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh p-6">
      <div className="text-center glass-strong rounded-3xl p-10 max-w-md shadow-soft">
        <p className="font-display text-7xl font-bold text-gradient">404</p>
        <h1 className="font-display text-xl font-semibold mt-4">Página no encontrada</h1>
        <p className="text-sm text-muted-foreground mt-2">La ruta que buscas no existe o fue movida.</p>
        <Link to="/">
          <Button className="mt-6 rounded-xl bg-gradient-primary shadow-glow">
            <Home className="w-4 h-4 mr-2" /> Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
