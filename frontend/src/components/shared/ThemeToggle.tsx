import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle({ showDropdown = true }: { showDropdown?: boolean }) {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  if (!showDropdown) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="rounded-xl h-9 w-9 bg-muted/60 hover:bg-muted transition-all duration-300"
        title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        aria-label="Cambiar tema"
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 rotate-0 scale-100 transition-all duration-300" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 rotate-0 scale-100 transition-all duration-300" />
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-9 w-9 bg-muted/60 hover:bg-muted border border-border/40 transition-all duration-300"
          title="Modo Oscuro / Claro"
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-primary transition-all duration-300" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500 transition-all duration-300" />
          )}
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl shadow-soft border-border/80 min-w-[130px]">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`text-xs flex items-center gap-2 rounded-lg cursor-pointer ${theme === 'light' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
        >
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`text-xs flex items-center gap-2 rounded-lg cursor-pointer ${theme === 'dark' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
        >
          <Moon className="h-3.5 w-3.5 text-primary" />
          <span>Oscuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`text-xs flex items-center gap-2 rounded-lg cursor-pointer ${theme === 'system' ? 'bg-primary/10 text-primary font-semibold' : ''}`}
        >
          <Laptop className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}