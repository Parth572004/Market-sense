import { Bug, RefreshCcw, ScanSearch, Sparkles } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore.js';

export function TopBar() {
  const setModalOpen = useMarketStore((state) => state.setModalOpen);
  const explainMode = useMarketStore((state) => state.explainMode);
  const runScan = useMarketStore((state) => state.runScan);
  const scanning = useMarketStore((state) => state.scanning);
  const lastScanMeta = useMarketStore((state) => state.lastScanMeta);
  const demoMode = useMarketStore((state) => state.demoMode);
  const toggleDemoMode = useMarketStore((state) => state.toggleDemoMode);
  const debugOpen = useMarketStore((state) => state.debugOpen);
  const setDebugOpen = useMarketStore((state) => state.setDebugOpen);

  const toggleExplain = () => {
    const nextMode = explainMode === 'simple' ? 'normal' : 'simple';
    runScan({ explainMode: nextMode });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 bg-surface/70 backdrop-blur-xl shadow-2xl shadow-black/40 ghost-border">
      <div className="flex h-full items-center justify-between px-5 md:px-8">
        <div className="min-w-0">
          <div className="font-headline text-xl font-extrabold tracking-tight text-primary drop-shadow-[0_0_8px_rgba(71,234,237,0.35)]">
            Market Sense
          </div>
          <div className="hidden text-[11px] uppercase tracking-[0.18em] text-secondary/70 sm:block">
            {demoMode ? 'Demo mode active' : lastScanMeta?.fromFallback ? 'Fallback intelligence active' : 'Live intelligence layer'}
          </div>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          <a className="text-sm font-semibold text-primary" href="#global-pulse">Intelligence</a>
          <a className="text-sm font-semibold text-secondary transition-colors hover:text-on-surface" href="#markets">Markets</a>
          <a className="text-sm font-semibold text-secondary transition-colors hover:text-on-surface" href="#regions">Regions</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-variant md:inline-flex"
            disabled={scanning}
            onClick={toggleExplain}
            type="button"
          >
            {explainMode === 'simple' ? 'Normal' : "Explain Like I'm 15"}
          </button>
          <button
            className={`hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors sm:inline-flex ${
              demoMode ? 'bg-primary/15 text-primary' : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
            disabled={scanning}
            onClick={toggleDemoMode}
            type="button"
          >
            <Sparkles className="h-4 w-4" />
            Demo Mode
          </button>
          <button
            className="hidden items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:text-on-surface sm:inline-flex"
            disabled={scanning}
            onClick={() => runScan({})}
            type="button"
          >
            <RefreshCcw className={scanning ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            Refresh
          </button>
          <button
            aria-label="Debug"
            className={`hidden rounded-xl p-2 transition-colors md:inline-flex ${
              debugOpen ? 'bg-primary/15 text-primary' : 'text-secondary hover:bg-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setDebugOpen(!debugOpen)}
            type="button"
          >
            <Bug className="h-4 w-4" />
          </button>
          <button
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-extrabold shadow-glow transition-transform active:scale-95"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            <ScanSearch className="h-4 w-4" />
            Quick Scan
          </button>
        </div>
      </div>
    </header>
  );
}
