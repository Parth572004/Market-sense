import { useEffect } from 'react';
import { ErrorBanner } from './components/ErrorBanner.jsx';
import { DetailPanel } from './components/DetailPanel.jsx';
import { DebugPanel } from './components/DebugPanel.jsx';
import { LoadingOverlay } from './components/LoadingOverlay.jsx';
import { MarketMap } from './components/MarketMap.jsx';
import { NewsRail } from './components/NewsRail.jsx';
import { QuickScanModal } from './components/QuickScanModal.jsx';
import { RegionStrip } from './components/RegionStrip.jsx';
import { SideNav } from './components/SideNav.jsx';
import { TopBar } from './components/TopBar.jsx';
import { useMarketStore } from './store/useMarketStore.js';

export default function App() {
  const initialize = useMarketStore((state) => state.initialize);
  const loading = useMarketStore((state) => state.loading);
  const scanning = useMarketStore((state) => state.scanning);
  const modalOpen = useMarketStore((state) => state.modalOpen);
  const debugOpen = useMarketStore((state) => state.debugOpen);
  const error = useMarketStore((state) => state.error);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-on-surface">
      <MarketMap />
      <TopBar />
      <SideNav />
      <RegionStrip />
      <DetailPanel />
      <NewsRail />
      <ErrorBanner error={error} />
      {(loading || scanning) && <LoadingOverlay scanning={scanning} />}
      {modalOpen && <QuickScanModal />}
      {debugOpen && <DebugPanel />}
    </div>
  );
}
