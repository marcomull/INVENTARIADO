import { ReactNode } from 'react';
import { Sparkles, Smartphone, Coffee, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import authBg from '@/assets/auth-bg.jpg';

/**
 * Layout para Login y Recuperar Contraseña con soporte para Modo Claro / Oscuro.
 */
export function PublicLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background transition-colors duration-300">
      {/* Botón flotante para cambiar tema en pantalla de login */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Fondo decorativo full-bleed (mobile) */}
      <div
        className="absolute inset-0 bg-cover bg-center lg:hidden opacity-70"
        style={{ backgroundImage: `url(${authBg})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-background/80 lg:hidden" aria-hidden />

      <div className="relative min-h-screen grid lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.2fr_1fr]">
        {/* Panel visual */}
        <aside className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden noise">
          <img
            src={authBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            width={1536}
            height={1536}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/20" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl glass-strong flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-lg leading-none text-foreground">Bloom</p>
              <p className="text-[11px] text-foreground/70 mt-1">Inventario & Ventas • 2026</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative max-w-md animate-fade-in-up">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/70 font-semibold mb-4">
              Tu boutique, en orden
            </p>
            <h2 className="font-serif-display text-5xl xl:text-6xl leading-[1.05] text-foreground">
              Donde tu negocio <em className="text-primary">florece</em> cada día.
            </h2>
            <p className="text-foreground/75 mt-5 text-sm xl:text-base leading-relaxed">
              Accesorios, snacks y bebidas — gestionados con un panel hecho con cariño,
              estética y la tecnología más fresca del 2026.
            </p>

            {/* Mini features */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { icon: Smartphone, label: 'Accesorios' },
                { icon: Coffee, label: 'Snacks' },
                { icon: ShieldCheck, label: 'Seguro' },
              ].map((f) => (
                <div key={f.label} className="glass rounded-2xl px-3 py-3 flex flex-col items-start gap-1.5">
                  <f.icon className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-medium text-foreground/80">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-[11px] text-foreground/60">
            © {new Date().getFullYear()} Bloom • Hecho con cariño en Perú 🇵🇪
          </p>
        </aside>

        {/* Panel formulario */}
        <main className="relative flex items-center justify-center p-6 lg:p-12 bg-mesh">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-accent/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-secondary/30 blur-3xl pointer-events-none" />

          <div className="relative w-full max-w-md animate-fade-in-up">
            {/* Logo móvil */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-11 h-11 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-none">Bloom</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Inventario & Ventas</p>
              </div>
            </div>

            <div className="glass-strong rounded-3xl p-7 lg:p-9 shadow-pop">
              <h1 className="font-serif-display text-4xl lg:text-[2.5rem] leading-tight">{title}</h1>
              <p className="text-sm text-muted-foreground mt-2 mb-7">{subtitle}</p>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}