import { ChevronDown, Globe2, Map, Settings, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMarketStore } from '../store/useMarketStore.js';
import { buildExploreFilters, translateExploreLabel } from '../utils/exploreFilters.js';
import { t } from '../utils/translations.js';

export function SideNav() {
  const config = useMarketStore((state) => state.config);
  const activeRegion = useMarketStore((state) => state.activeRegion);
  const activeFeedKind = useMarketStore((state) => state.activeFeedKind);
  const activeFilterLabel = useMarketStore((state) => state.activeFilterLabel);
  const runScan = useMarketStore((state) => state.runScan);
  const runStartupInsights = useMarketStore((state) => state.runStartupInsights);
  const scanning = useMarketStore((state) => state.scanning);
  const settingsOpen = useMarketStore((state) => state.settingsOpen);
  const setSettingsOpen = useMarketStore((state) => state.setSettingsOpen);
  const language = useMarketStore((state) => state.preferences.language);
  const [exploreOpen, setExploreOpen] = useState(false);
  const sidebarRef = useRef(null);
  const filters = useMemo(() => buildExploreFilters(config), [config]);

  useEffect(() => {
    if (!exploreOpen) return undefined;

    const handlePointerDown = (event) => {
      if (sidebarRef.current?.contains(event.target)) return;
      setExploreOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [exploreOpen]);

  const handleFilterSelect = (filter) => {
    setExploreOpen(false);

    if (filter.type === 'startup') {
      runStartupInsights({ region: filter.region, label: filter.label });
      return;
    }

    runScan({ region: filter.region, label: filter.label });
  };

  return (
    <aside
      className={`relative z-30 hidden h-full shrink-0 flex-row border-r border-outline-variant bg-white/94 backdrop-blur-md transition-[width] duration-200 md:flex ${
        exploreOpen ? 'w-[320px]' : 'w-[96px]'
      }`}
      ref={sidebarRef}
    >
      <div className="flex h-full w-[96px] shrink-0 flex-col items-center py-5">
        <div className="w-full px-4">
          <div className="flex flex-col items-center gap-1.5">
            <button
              aria-expanded={exploreOpen}
              aria-label={t(language, 'explore')}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all ${
                exploreOpen
                  ? 'border-primary/20 bg-primary/10 text-primary shadow-[0_14px_30px_rgba(13,148,136,0.16)]'
                  : 'border-transparent text-secondary hover:border-outline-variant hover:bg-surface-container-low hover:text-primary'
              }`}
              disabled={!filters.length}
              onClick={() => setExploreOpen((open) => !open)}
              type="button"
            >
              <Globe2 className="h-[18px] w-[18px]" />
            </button>
            <span className="max-w-[72px] text-center text-[0.58rem] font-semibold uppercase leading-3 tracking-[0.12em] text-secondary">
              {t(language, 'explore')}
            </span>
          </div>
        </div>

        <nav className="mt-6 flex flex-1 flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-1.5">
            <button
              aria-label={t(language, 'map')}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_14px_30px_rgba(13,148,136,0.16)] transition-transform hover:scale-105"
              type="button"
            >
              <Map className="h-[18px] w-[18px]" />
            </button>
            <span className="max-w-[60px] text-center text-[0.58rem] font-semibold uppercase leading-3 tracking-[0.12em] text-secondary">
              {t(language, 'map')}
            </span>
          </div>
        </nav>

        <div className="flex flex-col items-center gap-1.5 px-4">
          <button
            aria-label={t(language, 'settings')}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors ${
              settingsOpen
                ? 'border-primary/20 bg-primary/10 text-primary shadow-[0_14px_30px_rgba(13,148,136,0.16)]'
                : 'border-transparent text-secondary hover:border-outline-variant hover:bg-surface-container-low hover:text-primary'
            }`}
            onClick={() => setSettingsOpen(true)}
            type="button"
          >
            <Settings className="h-[18px] w-[18px]" />
          </button>
          <span className="max-w-[60px] text-center text-[0.58rem] font-semibold uppercase leading-3 tracking-[0.12em] text-secondary">
            {t(language, 'settings')}
          </span>
        </div>
      </div>

      {exploreOpen && filters.length > 0 ? (
        <div className="hide-scrollbar flex min-w-0 flex-1 flex-col overflow-y-auto border-l border-outline-variant bg-white/88 p-4">
          <div className="mb-3 shrink-0 border-b border-outline-variant pb-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-secondary">
              {t(language, 'explore')}
            </p>
            <p className="mt-1 text-[0.92rem] font-semibold text-on-surface">
              {translateExploreLabel(language, activeFilterLabel || activeRegion)}
            </p>
          </div>
          <div className="space-y-2">
            {filters.map((filter) => {
              const active = activeFeedKind === filter.type && activeRegion === filter.region;

              return (
                <button
                  className={`flex w-full items-center justify-between rounded-[1rem] border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? 'border-primary/20 bg-primary/10 text-primary'
                      : 'border-outline-variant bg-surface-container-low text-secondary hover:border-primary/20 hover:text-on-surface'
                  }`}
                  disabled={scanning}
                  key={filter.id}
                  onClick={() => handleFilterSelect(filter)}
                  type="button"
                >
                  <span className="inline-flex items-center gap-2 text-[0.82rem] font-semibold">
                    {filter.type === 'startup' ? <Sparkles className="h-3.5 w-3.5" /> : <Globe2 className="h-3.5 w-3.5" />}
                    {translateExploreLabel(language, filter.label)}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${active ? '-rotate-90' : 'rotate-0'}`} />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
