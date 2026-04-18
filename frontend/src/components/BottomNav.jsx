import { Lightbulb, RefreshCcw, ScanSearch, Settings } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore.js';
import { t } from '../utils/translations.js';

export function BottomNav() {
  const setModalOpen = useMarketStore((state) => state.setModalOpen);
  const setSettingsOpen = useMarketStore((state) => state.setSettingsOpen);
  const refreshCurrentFeed = useMarketStore((state) => state.refreshCurrentFeed);
  const runStartupInsights = useMarketStore((state) => state.runStartupInsights);
  const language = useMarketStore((state) => state.preferences.language);
  const scanning = useMarketStore((state) => state.scanning);
  const lastScanMeta = useMarketStore((state) => state.lastScanMeta);
  const activeRegion = useMarketStore((state) => state.activeRegion);

  const isStartupFeed = lastScanMeta?.kind === 'startup_insights';
  const startupLabel = activeRegion === 'India' ? 'Startup India' : 'Startup Global';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-outline-variant bg-white/95 px-4 pb-safe backdrop-blur-md md:hidden">
      <button
        className="flex flex-col items-center justify-center gap-1 px-3 text-secondary transition-colors hover:text-primary active:scale-90"
        disabled={scanning}
        onClick={refreshCurrentFeed}
        type="button"
      >
        <RefreshCcw className={`h-5 w-5 ${scanning ? 'animate-spin' : ''}`} />
        <span className="text-[0.65rem] font-bold uppercase tracking-wider">{t(language, 'refresh')}</span>
      </button>

      <button
        className={`flex flex-col items-center justify-center gap-1 px-3 transition-colors active:scale-90 ${
          isStartupFeed ? 'text-primary' : 'text-secondary hover:text-primary'
        }`}
        disabled={scanning}
        onClick={() => runStartupInsights({
          region: activeRegion === 'India' ? 'India' : 'Global',
          label: startupLabel
        })}
        type="button"
      >
        <Lightbulb className="h-5 w-5" />
        <span className="text-[0.65rem] font-bold uppercase tracking-wider">{t(language, 'startup')}</span>
      </button>

      <button
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-glow transition-transform active:scale-90"
        onClick={() => setModalOpen(true)}
        type="button"
      >
        <ScanSearch className="h-6 w-6" />
      </button>

      <button
        className="flex flex-col items-center justify-center gap-1 px-3 text-secondary transition-colors hover:text-primary active:scale-90"
        onClick={() => setSettingsOpen(true)}
        type="button"
      >
        <Settings className="h-5 w-5" />
        <span className="text-[0.65rem] font-bold uppercase tracking-wider">{t(language, 'settings')}</span>
      </button>
    </nav>
  );
}
