import { Globe2, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { useMarketStore } from '../store/useMarketStore.js';
import { buildExploreFilters, translateExploreLabel } from '../utils/exploreFilters.js';
import { t } from '../utils/translations.js';

export function RegionStrip() {
  const config = useMarketStore((state) => state.config);
  const activeRegion = useMarketStore((state) => state.activeRegion);
  const activeFeedKind = useMarketStore((state) => state.activeFeedKind);
  const runScan = useMarketStore((state) => state.runScan);
  const runStartupInsights = useMarketStore((state) => state.runStartupInsights);
  const scanning = useMarketStore((state) => state.scanning);
  const language = useMarketStore((state) => state.preferences.language);

  const filters = useMemo(() => buildExploreFilters(config), [config]);

  if (!filters.length) return null;

  return (
    <div className="relative z-20 shrink-0 md:hidden">
      <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto rounded-2xl border border-outline-variant bg-white/96 px-3 py-2 shadow-[0_14px_32px_rgba(15,23,42,0.1)] backdrop-blur-md">
        <div className="flex shrink-0 items-center gap-2 pr-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-secondary">
          <Globe2 className="h-4 w-4 text-primary" />
          {t(language, 'explore')}
        </div>
        {filters.map((filter) => {
          const active = activeFeedKind === filter.type && activeRegion === filter.region;

          return (
            <button
              className={`shrink-0 rounded-full border px-3 py-2 text-[0.82rem] font-semibold transition-colors ${
                active
                  ? 'border-primary/20 bg-primary/10 text-primary'
                  : 'border-outline-variant bg-surface-container-low text-secondary hover:border-primary/20 hover:text-on-surface'
              }`}
              disabled={scanning}
              key={filter.id}
              onClick={() => (
                filter.type === 'startup'
                  ? runStartupInsights({ region: filter.region, label: filter.label })
                  : runScan({ region: filter.region, label: filter.label })
              )}
              type="button"
            >
              <span className="inline-flex items-center gap-2">
                {filter.type === 'startup' && <Sparkles className="h-3.5 w-3.5" />}
                {translateExploreLabel(language, filter.label)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
