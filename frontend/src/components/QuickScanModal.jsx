import { X } from 'lucide-react';
import { useState } from 'react';
import { useMarketStore } from '../store/useMarketStore.js';

const scopes = ['Global Macro', 'US Equities', 'Indian Markets', 'Emerging Markets'];

export function QuickScanModal() {
  const currentScope = useMarketStore((state) => state.scope);
  const currentFocus = useMarketStore((state) => state.focus);
  const selectedRegion = useMarketStore((state) => state.selectedRegion);
  const demoMode = useMarketStore((state) => state.demoMode);
  const runScan = useMarketStore((state) => state.runScan);
  const setModalOpen = useMarketStore((state) => state.setModalOpen);
  const scanning = useMarketStore((state) => state.scanning);
  const [scope, setScope] = useState(currentScope);
  const [focus, setFocus] = useState(currentFocus);

  const submit = (event) => {
    event.preventDefault();
    runScan({ scope, focus, region: selectedRegion, demoMode, provider: demoMode ? 'demo' : 'auto' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/80 p-4 backdrop-blur-sm">
      <form className="w-full max-w-lg overflow-hidden rounded-xl shadow-glass glass-panel ghost-border" onSubmit={submit}>
        <header className="flex items-center justify-between bg-surface-container-highest/55 p-5 ghost-border">
          <div>
            <h2 className="font-headline text-xl font-bold text-on-surface">Configure Quick Scan</h2>
            <p className="mt-1 text-sm text-secondary">
              {demoMode ? 'Curated high-impact demo intelligence.' : 'Scan live providers or fallback intelligence.'}
            </p>
          </div>
          <button
            aria-label="Close"
            className="rounded-xl p-2 text-secondary transition-colors hover:bg-surface-variant hover:text-on-surface"
            onClick={() => setModalOpen(false)}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-5">
          <div>
            <label className="mb-3 block text-sm font-bold text-on-surface">Scan scope</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {scopes.map((option) => (
                <button
                  className={`rounded-xl p-3 text-sm font-semibold transition-colors ghost-border ${
                    scope === option ? 'bg-primary/15 text-primary' : 'bg-surface-container-low text-secondary hover:text-on-surface'
                  }`}
                  key={option}
                  onClick={() => setScope(option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-on-surface">Focus area</span>
            <input
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none ghost-border placeholder:text-secondary/60 focus:border-primary"
              onChange={(event) => setFocus(event.target.value)}
              placeholder="AI sector, fuel prices, supply chains"
              value={focus}
            />
          </label>
        </div>

        <footer className="flex justify-end gap-3 p-5 pt-0">
          <button
            className="rounded-xl px-5 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-variant"
            onClick={() => setModalOpen(false)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="btn-gradient rounded-xl px-6 py-2 text-sm font-extrabold shadow-glow transition-transform active:scale-95 disabled:opacity-70"
            disabled={scanning}
            type="submit"
          >
            {scanning ? 'Scanning...' : 'Initiate Scan'}
          </button>
        </footer>
      </form>
    </div>
  );
}
