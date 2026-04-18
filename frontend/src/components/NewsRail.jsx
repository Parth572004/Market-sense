import { EventCard } from './EventCard.jsx';
import { EMPTY_TRANSLATIONS, t } from '../utils/translations.js';

export function NewsRail({
  events = [],
  selectedEventId = null,
  onSelectEvent = () => {},
  lastScanMeta = null,
  showSourceMetadata = true,
  language = 'en',
  isCompact = false,
  contentTranslations = EMPTY_TRANSLATIONS
}) {
  const safeEvents = Array.isArray(events) ? events : [];
  const railSummary = showSourceMetadata
    ? lastScanMeta?.provider
      ? t(language, 'sourceLine', { provider: lastScanMeta.provider })
      : t(language, 'waitingForScan')
    : t(language, 'activeStories', { count: safeEvents.length });

  return (
    <section className="flex min-h-[13.25rem] shrink-0 flex-col overflow-hidden rounded-[1.6rem] border border-outline-variant bg-white/94 p-3.5 shadow-[0_18px_42px_rgba(15,23,42,0.09)]">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[0.78rem] text-secondary">
          {railSummary}
          {showSourceMetadata && lastScanMeta?.cache === 'hit' ? ` | ${t(language, 'cached')}` : ''}
        </p>
      </div>
      <div className="hide-scrollbar -mx-1 flex flex-1 gap-2.5 overflow-x-auto px-1 pb-1">
        {safeEvents.map((event) => (
          <EventCard
            active={selectedEventId === event.id}
            contentTranslations={contentTranslations}
            event={event}
            isCompact={isCompact}
            key={event.id}
            language={language}
            onSelect={() => onSelectEvent(event.id)}
          />
        ))}
      </div>
    </section>
  );
}
