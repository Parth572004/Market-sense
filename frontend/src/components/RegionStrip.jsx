import { Globe2 } from 'lucide-react';
import { useMemo } from 'react';
import { useMarketStore } from '../store/useMarketStore.js';
import { debounce } from '../utils/debounce.js';

export function RegionStrip() {
  const config = useMarketStore((state) => state.config);
  const selectedRegion = useMarketStore((state) => state.selectedRegion);
  const selectedCategory = useMarketStore((state) => state.selectedCategory);
  const runScan = useMarketStore((state) => state.runScan);
  const scanning = useMarketStore((state) => state.scanning);
  const demoMode = useMarketStore((state) => state.demoMode);

  const regions = config?.regions || [];
  const debouncedRunScan = useMemo(() => debounce((payload) => runScan(payload), 300), [runScan]);

  return (
    <div className="fixed left-4 right-4 top-20 z-30 md:left-28 md:right-[470px]">
      <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto rounded-xl bg-surface-container-lowest/55 p-2 backdrop-blur-md ghost-border">
        <div className="flex shrink-0 items-center gap-2 px-2 text-xs font-bold uppercase tracking-widest text-secondary/80">
          <Globe2 className="h-4 w-4 text-primary" />
          Regions
        </div>
        {regions.map((region) => (
          <button
            className={`shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              selectedRegion === region.name
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
            disabled={scanning}
            key={region.name}
            onClick={() => debouncedRunScan({ region: region.name, category: selectedCategory, demoMode, provider: demoMode ? 'demo' : 'auto' })}
            type="button"
          >
            {region.name}
          </button>
        ))}
      </div>
    </div>
  );
}
