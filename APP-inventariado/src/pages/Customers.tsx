import { HeartHandshake, Sparkles } from 'lucide-react';

export default function Customers() {
  return (
    <div className="glass rounded-3xl p-10 lg:p-16 text-center bg-gradient-soft">
      <div className="relative w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center mx-auto shadow-glow">
        <HeartHandshake className="w-9 h-9 text-primary-foreground" />
        <Sparkles className="w-5 h-5 text-accent absolute -top-2 -right-2 animate-pulse" />
      </div>
      <span className="inline-block mt-6 px-3 py-1 rounded-full bg-accent-soft text-accent-foreground text-[11px] font-semibold uppercase tracking-wider">
        Próximamente
      </span>
      <h2 className="font-display text-2xl lg:text-3xl font-semibold mt-4">Módulo de Clientes</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        Pronto podrás registrar a tus clientes, ver su historial de compras, fidelizarlos con descuentos y enviarles notificaciones cariñosas. 💌
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mt-8 max-w-2xl mx-auto">
        {[
          { title: 'Historial', desc: 'Compras y preferencias' },
          { title: 'Fidelización', desc: 'Puntos y descuentos' },
          { title: 'Comunicación', desc: 'Notas y recordatorios' },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl bg-card/60 p-4 border border-border">
            <p className="font-medium text-sm">{f.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
