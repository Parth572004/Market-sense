import { BarChart3, Map, RadioTower, Settings } from 'lucide-react';

const items = [
  { label: 'Map', icon: Map, active: true },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Signals', icon: RadioTower }
];

export function SideNav() {
  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-64px)] w-20 flex-col items-center bg-surface-container-lowest/55 py-6 backdrop-blur-md md:flex">
      <div className="mb-8 flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high font-headline text-lg font-black text-primary ghost-border">
          MS
        </div>
        <span className="mt-2 text-[10px] uppercase tracking-wider text-secondary/60">Intel</span>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-5">
        {items.map(({ label, icon: Icon, active }) => (
          <button
            aria-label={label}
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform hover:scale-105 ${
              active ? 'bg-primary/10 text-primary shadow-glow' : 'text-secondary/60 hover:text-primary'
            }`}
            key={label}
            type="button"
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </nav>

      <button
        aria-label="Settings"
        className="flex h-12 w-12 items-center justify-center rounded-xl text-secondary/60 transition-colors hover:text-primary"
        type="button"
      >
        <Settings className="h-5 w-5" />
      </button>
    </aside>
  );
}
