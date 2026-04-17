import { RefreshCcw, X } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore.js';

export function DebugPanel() {
  const debugData = useMarketStore((state) => state.debugData);
  const refreshDebug = useMarketStore((state) => state.refreshDebug);
  const setDebugOpen = useMarketStore((state) => state.setDebugOpen);
  const lastScan = debugData?.lastScan;

  return (
    <aside className="fixed bottom-5 left-4 z-[85] w-[min(560px,calc(100vw-32px))] overflow-hidden rounded-xl shadow-glass glass-panel ghost-border md:left-28">
      <header className="flex items-center justify-between bg-surface-container-highest/55 p-4 ghost-border">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">Debug Panel</h2>
          <p className="text-xs text-secondary">Source, classification, AI path, processing time</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-xl p-2 text-secondary transition-colors hover:bg-surface-variant hover:text-on-surface"
            onClick={refreshDebug}
            type="button"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button
            className="rounded-xl p-2 text-secondary transition-colors hover:bg-surface-variant hover:text-on-surface"
            onClick={() => setDebugOpen(false)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="max-h-[44vh] space-y-4 overflow-y-auto p-4">
        {!lastScan ? (
          <p className="text-sm text-secondary">Run a scan to populate debug data.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
              <Metric label="Source" value={lastScan.source || lastScan.provider || 'unknown'} />
              <Metric label="Fallback" value={lastScan.fromFallback ? 'yes' : 'no'} />
              <Metric label="Demo" value={lastScan.demoMode ? 'yes' : 'no'} />
              <Metric label="Latency" value={`${lastScan.processingTimeMs || 0}ms`} />
            </div>
            <div className="rounded-xl bg-surface-container-low p-3 text-xs text-secondary ghost-border">
              <span className="font-bold text-on-surface">Query:</span> {lastScan.query || 'n/a'}
            </div>
            <div className="space-y-2">
              {(lastScan.events || []).map((event) => (
                <div className="rounded-xl bg-surface-container-low p-3 text-xs ghost-border" key={event.id}>
                  <div className="font-semibold text-on-surface">{event.title}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-secondary md:grid-cols-4">
                    <span>Category: {event.category}</span>
                    <span>Score: {event.classification_score}</span>
                    <span>Priority: {event.priority}</span>
                    <span>AI: {event.ai_provider || 'rule_engine'} / {event.ai_status || 'n/a'}</span>
                  </div>
                  <div className="mt-2 text-secondary">
                    Keywords: {(event.matched_keywords || []).join(', ') || 'none'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-container-low p-3 ghost-border">
      <div className="uppercase tracking-widest text-secondary/70">{label}</div>
      <div className="mt-1 font-headline text-sm font-bold text-on-surface">{value}</div>
    </div>
  );
}
