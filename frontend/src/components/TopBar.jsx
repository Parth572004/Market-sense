import { ChevronDown, Languages, Lightbulb, RefreshCcw, ScanSearch } from 'lucide-react';
import growthIcon from '../assets/market-sense-growth-icon-brand.png';
import { useMarketStore } from '../store/useMarketStore.js';
import { getLanguageLabel, LANGUAGE_OPTIONS, t } from '../utils/translations.js';

export function TopBar() {
  const setModalOpen = useMarketStore((state) => state.setModalOpen);
  const refreshCurrentFeed = useMarketStore((state) => state.refreshCurrentFeed);
  const runStartupInsights = useMarketStore((state) => state.runStartupInsights);
  const setLanguage = useMarketStore((state) => state.setLanguage);
  const language = useMarketStore((state) => state.preferences.language);
  const translationPending = useMarketStore((state) => state.translationPending);
  const scanning = useMarketStore((state) => state.scanning);
  const lastScanMeta = useMarketStore((state) => state.lastScanMeta);
  const activeRegion = useMarketStore((state) => state.activeRegion);

  const isStartupFeed = lastScanMeta?.kind === 'startup_insights';
  const startupLabel = activeRegion === 'India' ? 'Startup India' : 'Startup Global';
  const currentLanguageLabel = getLanguageLabel(language);

  return (
    <header className="relative z-50 h-[72px] shrink-0 border-b border-white/70 bg-white/95 backdrop-blur-xl shadow-[0_14px_34px_rgba(15,23,42,0.14)]">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-7">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <img
              alt="MarketSense growth icon"
              className="h-10 w-auto shrink-0 select-none md:h-11"
              draggable="false"
              src={growthIcon}
            />
            <div className="min-w-0">
              <div className="brand-wordmark text-[1.55rem] leading-none md:text-[1.7rem]">
                MarketSense
              </div>
              <div className="hidden text-[0.72rem] uppercase tracking-[0.22em] text-slate-500 sm:block">
                {t(language, 'brandTagline')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center gap-2 rounded-[1.35rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(240,253,250,0.98))] px-2.5 py-2 shadow-[0_14px_30px_rgba(15,23,42,0.09)]">
            <div className="hidden items-center gap-2 rounded-[1rem] bg-primary/10 px-2.5 py-2 text-primary lg:flex">
              <Languages className="h-4 w-4" />
              <div className="leading-tight">
                <div className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-secondary">
                  {t(language, 'language')}
                </div>
                <div className="text-[0.78rem] font-semibold text-on-surface">
                  {translationPending > 0 && language !== 'en'
                    ? t(language, 'translatingHeadlines')
                    : currentLanguageLabel}
                </div>
              </div>
            </div>
            <div className="relative">
              <select
                aria-label={t(language, 'language')}
                className="appearance-none rounded-[0.95rem] border border-transparent bg-slate-950/5 py-2 pl-3 pr-10 text-[0.82rem] font-bold text-on-surface outline-none transition-colors hover:border-primary/20 focus:border-primary/30"
                onChange={(event) => setLanguage(event.target.value)}
                value={language}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            </div>
          </div>
          <button
            className="hidden items-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-secondary shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors hover:border-primary/30 hover:text-on-surface sm:inline-flex"
            disabled={scanning}
            onClick={refreshCurrentFeed}
            type="button"
          >
            <RefreshCcw className={scanning ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            {t(language, 'refresh')}
          </button>
          <button
            className={`hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-[0.9rem] font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors md:inline-flex ${
              isStartupFeed
                ? 'border-primary/25 bg-primary/10 text-primary'
                : 'border-outline-variant bg-white text-secondary hover:border-primary/25 hover:text-on-surface'
            }`}
            disabled={scanning}
            onClick={() => runStartupInsights({
              region: activeRegion === 'India' ? 'India' : 'Global',
              label: startupLabel
            })}
            type="button"
          >
            <Lightbulb className="h-4 w-4" />
            {t(language, 'startupInsights')}
          </button>
          <button
            className="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.9rem] font-extrabold shadow-glow transition-transform active:scale-95"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            <ScanSearch className="h-4 w-4" />
            {t(language, 'quickScan')}
          </button>
        </div>
      </div>
    </header>
  );
}
