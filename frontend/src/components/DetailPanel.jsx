import { CheckCircle2, Info, Landmark, Route, TrendingUp, WalletCards } from 'lucide-react';
import { useMemo } from 'react';
import { useMarketStore } from '../store/useMarketStore.js';
import { formatCategory, getCategoryColor } from '../utils/categoryColors.js';
import { formatRelativeDate } from '../utils/formatDate.js';

function DetailSection({ icon: Icon, title, children }) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-on-surface">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-3">
      {(items || []).map((item) => (
        <li className="rounded-xl bg-surface-container-low p-3 text-sm leading-relaxed text-on-surface-variant ghost-border" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function DetailPanel() {
  const events = useMarketStore((state) => state.events);
  const selectedEventId = useMarketStore((state) => state.selectedEventId);
  const explainMode = useMarketStore((state) => state.explainMode);
  const lastScanMeta = useMarketStore((state) => state.lastScanMeta);
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) || events[0] || null,
    [events, selectedEventId]
  );

  if (!selectedEvent) {
    return (
      <aside className="fixed bottom-36 left-4 right-4 z-30 rounded-xl p-6 md:left-auto md:right-4 md:top-32 md:w-[420px] glass-panel ghost-border">
        <p className="text-sm text-secondary">Run a scan to load active intelligence.</p>
      </aside>
    );
  }

  return (
    <aside className="fixed bottom-36 left-4 right-4 z-40 flex max-h-[42vh] flex-col overflow-hidden rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.4)] md:bottom-0 md:left-auto md:right-0 md:top-16 md:max-h-none md:w-full md:max-w-[450px] md:rounded-none glass-panel ghost-border">
      <header className="p-4 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-xl bg-surface-container-low px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary">
            Node Active
          </span>
          <span className={`rounded-xl px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider ${getCategoryColor(selectedEvent.category)}`}>
            {selectedEvent.category_label || formatCategory(selectedEvent.category)}
          </span>
          <span className="text-xs text-secondary">{formatRelativeDate(selectedEvent.published_at)}</span>
        </div>
        <h2 className="font-headline text-2xl font-bold leading-tight text-on-surface">
          {selectedEvent.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-secondary">
          {explainMode === 'simple' ? selectedEvent.what_happened : selectedEvent.summary}
        </p>
      </header>

      <div className="hide-scrollbar flex-1 space-y-7 overflow-y-auto bg-surface-container-lowest/45 p-4 md:p-6">
        <DetailSection icon={Info} title="What happened">
          <p className="rounded-xl bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface-variant ghost-border">
            {selectedEvent.what_happened}
          </p>
        </DetailSection>

        <DetailSection icon={Landmark} title="Why it matters">
          <p className="rounded-xl bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface-variant ghost-border">
            {selectedEvent.why_it_matters}
          </p>
        </DetailSection>

        <DetailSection icon={TrendingUp} title="Market impact">
          <BulletList items={selectedEvent.market_impact || []} />
        </DetailSection>

        <DetailSection icon={WalletCards} title="Personal impact">
          <BulletList items={selectedEvent.personal_finance_impact || []} />
        </DetailSection>

        <DetailSection icon={CheckCircle2} title="Suggested action">
          <p className="rounded-xl bg-primary/10 p-4 text-sm font-semibold leading-relaxed text-on-surface ghost-border">
            {selectedEvent.suggested_action}
          </p>
        </DetailSection>

        <DetailSection icon={Route} title="Possible outcomes">
          <BulletList items={selectedEvent.possible_outcomes || []} />
        </DetailSection>
      </div>

      <footer className="bg-surface-container-high p-4 text-xs text-secondary ghost-border">
        {lastScanMeta?.fromFallback
          ? `Fallback mode: ${lastScanMeta.fallbackReason || 'live provider unavailable'}`
          : `AI status: ${selectedEvent.ai_provider || 'rule_engine'} · ${selectedEvent.source || 'source unavailable'}`}
      </footer>
    </aside>
  );
}
