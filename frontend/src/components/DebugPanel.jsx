import { RefreshCcw, X } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore.js';
import { EMPTY_TRANSLATIONS, translateCachedText, translateLabel, t } from '../utils/translations.js';

export function DebugPanel() {
  const debugData = useMarketStore((state) => state.debugData);
  const refreshDebug = useMarketStore((state) => state.refreshDebug);
  const setDebugOpen = useMarketStore((state) => state.setDebugOpen);
  const language = useMarketStore((state) => state.preferences.language);
  const translationCache = useMarketStore((state) => state.contentTranslations);
  const contentTranslations = translationCache[language] || EMPTY_TRANSLATIONS;
  const lastScan = debugData?.lastScan;

  return (
    <aside className="fixed bottom-5 left-4 z-[85] w-[min(580px,calc(100vw-32px))] overflow-hidden rounded-[1.6rem] border border-outline-variant bg-white shadow-glass md:left-28">
      <header className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-5">
        <div>
          <h2 className="font-headline text-[1.3rem] font-bold text-on-surface">{t(language, 'debugPanel')}</h2>
          <p className="text-[0.92rem] text-secondary">{t(language, 'debugPanelDescription')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-2xl p-3 text-secondary transition-colors hover:bg-white hover:text-on-surface"
            onClick={refreshDebug}
            type="button"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button
            className="rounded-2xl p-3 text-secondary transition-colors hover:bg-white hover:text-on-surface"
            onClick={() => setDebugOpen(false)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="max-h-[44vh] space-y-4 overflow-y-auto p-5">
        {!lastScan ? (
          <p className="text-[0.98rem] text-secondary">{t(language, 'runScanToPopulateDebug')}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 text-[0.84rem] md:grid-cols-4">
              <Metric label={t(language, 'source')} value={lastScan.source || lastScan.provider || t(language, 'unknown')} />
              <Metric label={t(language, 'fallback')} value={lastScan.fromFallback ? t(language, 'yes') : t(language, 'no')} />
              <Metric label={t(language, 'demo')} value={lastScan.demoMode ? t(language, 'yes') : t(language, 'no')} />
              <Metric label={t(language, 'latency')} value={`${lastScan.processingTimeMs || 0}ms`} />
            </div>
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4 text-[0.88rem] text-secondary">
              <span className="font-bold text-on-surface">{t(language, 'query')}:</span> {lastScan.query || 'n/a'}
            </div>
            <div className="space-y-2">
              {(lastScan.events || []).map((event) => (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4 text-[0.84rem]" key={event.id}>
                  <div className="font-semibold text-on-surface">{translateCachedText(language, contentTranslations, event.title)}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-secondary md:grid-cols-4">
                    <span>{t(language, 'category')}: {translateLabel(language, event.category)}</span>
                    <span>{t(language, 'score')}: {event.classification_score}</span>
                    <span>{t(language, 'priority')}: {translateLabel(language, event.priority)}</span>
                    <span>{t(language, 'ai')}: {translateLabel(language, event.ai_provider || 'rule_engine')} / {event.ai_status || 'n/a'}</span>
                  </div>
                  <div className="mt-2 text-secondary">
                    {t(language, 'keywords')}: {(event.matched_keywords || []).join(', ') || t(language, 'none')}
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
    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
      <div className="uppercase tracking-[0.16em] text-secondary">{label}</div>
      <div className="mt-2 font-headline text-[1rem] font-bold text-on-surface">{value}</div>
    </div>
  );
}
