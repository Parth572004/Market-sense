import { EventCard } from './EventCard.jsx';
import { useMarketStore } from '../store/useMarketStore.js';

export function NewsRail() {
  const events = useMarketStore((state) => state.events);
  const selectedEventId = useMarketStore((state) => state.selectedEventId);
  const setSelectedEvent = useMarketStore((state) => state.setSelectedEvent);
  const lastScanMeta = useMarketStore((state) => state.lastScanMeta);

  return (
    <section className="fixed bottom-5 left-4 right-4 z-30 md:left-28 md:right-[470px]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">News Feed</p>
          <p className="text-xs text-secondary/80">
            {lastScanMeta?.provider ? `Source: ${lastScanMeta.provider}` : 'Waiting for scan'}
            {lastScanMeta?.cache === 'hit' ? ' · cached' : ''}
          </p>
        </div>
      </div>
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-3">
        {events.map((event) => (
          <EventCard
            active={selectedEventId === event.id}
            event={event}
            key={event.id}
            onSelect={() => setSelectedEvent(event.id)}
          />
        ))}
      </div>
    </section>
  );
}
