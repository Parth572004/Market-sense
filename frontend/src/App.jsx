import { useEffect } from 'react';
import { ErrorBanner } from './components/ErrorBanner.jsx';
import { DetailPanel } from './components/DetailPanel.jsx';
import { DebugPanel } from './components/DebugPanel.jsx';
import { LoadingOverlay } from './components/LoadingOverlay.jsx';
import { MarketMap } from './components/MarketMap.jsx';
import { NewsRail } from './components/NewsRail.jsx';
import { QuickScanModal } from './components/QuickScanModal.jsx';
import { RegionStrip } from './components/RegionStrip.jsx';
import { SettingsPanel } from './components/SettingsPanel.jsx';
import { SideNav } from './components/SideNav.jsx';
import { TopBar } from './components/TopBar.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { useMarketStore } from './store/useMarketStore.js';
import { collectEventTexts, EMPTY_TRANSLATIONS } from './utils/translations.js';

export default function App() {
  const initialize = useMarketStore((state) => state.initialize);
  const loading = useMarketStore((state) => state.loading);
  const scanning = useMarketStore((state) => state.scanning);
  const modalOpen = useMarketStore((state) => state.modalOpen);
  const settingsOpen = useMarketStore((state) => state.settingsOpen);
  const debugOpen = useMarketStore((state) => state.debugOpen);
  const error = useMarketStore((state) => state.error);
  const language = useMarketStore((state) => state.preferences.language);
  const autoRefreshMinutes = useMarketStore((state) => state.preferences.autoRefreshMinutes);
  const reduceMotion = useMarketStore((state) => state.preferences.reduceMotion);
  const detailPanelWidth = useMarketStore((state) => state.preferences.detailPanelWidth);
  const showSourceMetadata = useMarketStore((state) => state.preferences.showSourceMetadata);
  const isCompact = useMarketStore((state) => state.preferences.cardDensity === 'compact');
  const events = useMarketStore((state) => state.events);
  const selectedEventId = useMarketStore((state) => state.selectedEventId);
  const setSelectedEvent = useMarketStore((state) => state.setSelectedEvent);
  const lastScanMeta = useMarketStore((state) => state.lastScanMeta);
  const translationCache = useMarketStore((state) => state.contentTranslations);
  const refreshCurrentFeed = useMarketStore((state) => state.refreshCurrentFeed);
  const hydrateTranslations = useMarketStore((state) => state.hydrateTranslations);
  const hydrateUiTranslations = useMarketStore((state) => state.hydrateUiTranslations);
  const safeEvents = Array.isArray(events) ? events : [];
  const showScanningOverlay = scanning || (loading && safeEvents.length === 0);
  const contentTranslations = translationCache?.[language] || EMPTY_TRANSLATIONS;
  const desktopDetailLayout = detailPanelWidth === 'wide'
    ? 'lg:grid-cols-[minmax(0,1fr)_32rem] xl:grid-cols-[minmax(0,1fr)_35rem]'
    : 'lg:grid-cols-[minmax(0,1fr)_29rem] xl:grid-cols-[minmax(0,1fr)_31rem]';

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!autoRefreshMinutes) return undefined;

    const intervalId = window.setInterval(() => {
      refreshCurrentFeed();
    }, autoRefreshMinutes * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [autoRefreshMinutes, refreshCurrentFeed]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reduceMotion);
    return () => {
      document.documentElement.classList.remove('reduced-motion');
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (language === 'en') return;

    hydrateUiTranslations(language);
    hydrateTranslations([
      ...collectEventTexts(safeEvents),
      error,
      lastScanMeta?.fallbackReason
    ], language);
  }, [error, hydrateTranslations, hydrateUiTranslations, language, lastScanMeta?.fallbackReason, safeEvents]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-on-surface">
      <TopBar />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <SideNav />
        <main className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
          <div className="flex h-full min-h-0 flex-col gap-3 p-3 pb-20 md:gap-4 md:p-4 md:pb-4">
            <RegionStrip />
            <ErrorBanner error={error} />
            <div className={`grid min-h-0 flex-1 gap-4 ${desktopDetailLayout}`}>
              <div className="flex min-h-0 flex-col gap-4">
                <section className="min-h-[18rem] flex-1 overflow-hidden rounded-[1.8rem] border border-outline-variant bg-slate-950 shadow-[0_20px_48px_rgba(15,23,42,0.16)]">
                  <MarketMap
                    contentTranslations={contentTranslations}
                    events={safeEvents}
                    language={language}
                    onSelectEvent={setSelectedEvent}
                    selectedEventId={selectedEventId}
                    showSourceMetadata={showSourceMetadata}
                  />
                </section>
                <NewsRail
                  contentTranslations={contentTranslations}
                  events={safeEvents}
                  isCompact={isCompact}
                  language={language}
                  lastScanMeta={lastScanMeta}
                  onSelectEvent={setSelectedEvent}
                  selectedEventId={selectedEventId}
                  showSourceMetadata={showSourceMetadata}
                />
              </div>
              <DetailPanel
                contentTranslations={contentTranslations}
                events={safeEvents}
                isCompact={isCompact}
                language={language}
                lastScanMeta={lastScanMeta}
                selectedEventId={selectedEventId}
                showSourceMetadata={showSourceMetadata}
              />
            </div>
          </div>
        </main>
      </div>
      {(loading || scanning) && <LoadingOverlay scanning={showScanningOverlay} />}
      {modalOpen && <QuickScanModal />}
      {settingsOpen && <SettingsPanel />}
      {debugOpen && <DebugPanel />}
      <BottomNav />
    </div>
  );
}
