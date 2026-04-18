import { CheckCircle2, Info, Landmark, MapPin, Route, Sparkles, TrendingUp, WalletCards } from 'lucide-react';
import { useMemo } from 'react';
import { formatCategory, getCategoryColor } from '../utils/categoryColors.js';
import { formatNewsTimestamp } from '../utils/formatDate.js';
import { EMPTY_TRANSLATIONS, t, translateCachedList, translateCachedText, translateLabel } from '../utils/translations.js';

function DetailSection({ icon: Icon, title, children, className = '' }) {
  return (
    <section className={`rounded-[1rem] border border-outline-variant bg-white p-3 shadow-[0_10px_22px_rgba(15,23,42,0.045)] ${className}`}>
      <h3 className="mb-2 flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-on-surface">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-1.5">
      {(items || []).map((item) => (
        <li className="rounded-[0.85rem] border border-outline-variant bg-surface-container-low px-2.5 py-2 text-[0.78rem] leading-5 text-on-surface-variant" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function DetailPanel({
  events = [],
  selectedEventId = null,
  lastScanMeta = null,
  language = 'en',
  isCompact = false,
  showSourceMetadata = true,
  contentTranslations = EMPTY_TRANSLATIONS
}) {
  const safeEvents = Array.isArray(events) ? events : [];
  const selectedEvent = useMemo(
    () => safeEvents.find((event) => event.id === selectedEventId) || safeEvents[0] || null,
    [safeEvents, selectedEventId]
  );

  if (!selectedEvent) {
    return (
      <aside className="flex min-h-[22rem] flex-col rounded-[1.6rem] border border-outline-variant bg-white p-5 shadow-glass lg:h-full">
        <p className="text-[0.95rem] text-secondary">{t(language, 'runScanToLoadIntelligence')}</p>
      </aside>
    );
  }

  const categoryLabel = translateCachedText(language, contentTranslations, selectedEvent.category_label)
    || translateLabel(language, selectedEvent.category_label)
    || formatCategory(selectedEvent.category, language);
  const title = translateCachedText(language, contentTranslations, selectedEvent.title);
  const summary = translateCachedText(language, contentTranslations, selectedEvent.summary);
  const whatHappened = translateCachedText(language, contentTranslations, selectedEvent.what_happened);
  const whyItMatters = translateCachedText(language, contentTranslations, selectedEvent.why_it_matters);
  const suggestedAction = translateCachedText(language, contentTranslations, selectedEvent.suggested_action);
  const marketImpact = translateCachedList(language, contentTranslations, selectedEvent.market_impact || []);
  const personalFinanceImpact = translateCachedList(language, contentTranslations, selectedEvent.personal_finance_impact || []);
  const possibleOutcomes = translateCachedList(language, contentTranslations, selectedEvent.possible_outcomes || []);
  const fallbackReason = lastScanMeta?.fallbackReason
    ? translateCachedText(language, contentTranslations, lastScanMeta.fallbackReason)
    : translateLabel(language, 'live provider unavailable');
  const aiProvider = translateLabel(language, selectedEvent.ai_provider || 'rule_engine');
  const sourceLabel = translateCachedText(language, contentTranslations, selectedEvent.source || 'source unavailable')
    || translateLabel(language, selectedEvent.source || 'source unavailable');
  const regionLabel = translateCachedText(language, contentTranslations, selectedEvent.region)
    || translateLabel(language, selectedEvent.region);

  return (
    <aside className="flex min-h-[24rem] flex-col overflow-hidden rounded-[1.6rem] border border-outline-variant bg-white/96 shadow-[0_20px_48px_rgba(15,23,42,0.1)] lg:h-full">
      <header className={`border-b border-outline-variant bg-gradient-to-b from-surface-container-low to-white ${isCompact ? 'p-3.5' : 'p-4'}`}>
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-primary">
            {t(language, 'nodeActive')}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] ${getCategoryColor(selectedEvent.category)}`}>
            {categoryLabel}
          </span>
          <span className="text-[0.78rem] text-secondary">{formatNewsTimestamp(selectedEvent.published_at, language)}</span>
        </div>
        <h2 className={`font-headline font-bold leading-tight text-on-surface ${isCompact ? 'text-[1.25rem] md:text-[1.35rem]' : 'text-[1.42rem] md:text-[1.55rem]'}`}>
          {title}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {regionLabel}
          </span>
          {summary ? <span className="line-clamp-1">{summary}</span> : null}
        </div>
      </header>

      <div className={`hide-scrollbar flex-1 overflow-y-auto bg-slate-50/80 ${isCompact ? 'p-3' : 'p-3.5'}`}>
        <div className="grid gap-2.5 md:grid-cols-2">
          <DetailSection icon={Info} title={t(language, 'whatHappened')}>
            <p className={`rounded-[0.85rem] border border-outline-variant bg-surface-container-low p-2.5 text-on-surface-variant ${isCompact ? 'text-[0.76rem] leading-5' : 'text-[0.8rem] leading-5'}`}>
              {whatHappened}
            </p>
          </DetailSection>

          <DetailSection icon={Landmark} title={t(language, 'whyItMatters')}>
            <p className={`rounded-[0.85rem] border border-outline-variant bg-surface-container-low p-2.5 text-on-surface-variant ${isCompact ? 'text-[0.76rem] leading-5' : 'text-[0.8rem] leading-5'}`}>
              {whyItMatters}
            </p>
          </DetailSection>

          <DetailSection icon={TrendingUp} title={t(language, 'marketImpact')}>
            <BulletList items={marketImpact} />
          </DetailSection>

          <DetailSection icon={WalletCards} title={t(language, 'personalFinanceImpact')}>
            <BulletList items={personalFinanceImpact} />
          </DetailSection>

          <DetailSection icon={CheckCircle2} title={t(language, 'suggestedAction')}>
            <p className={`rounded-[0.85rem] border border-primary/15 bg-primary/10 p-2.5 font-semibold text-on-surface ${isCompact ? 'text-[0.78rem] leading-5' : 'text-[0.82rem] leading-5'}`}>
              {suggestedAction}
            </p>
          </DetailSection>

          <DetailSection icon={Route} title={t(language, 'possibleOutcomes')}>
            <BulletList items={possibleOutcomes} />
          </DetailSection>

          {selectedEvent.prediction ? (
            <DetailSection className="md:col-span-2" icon={Sparkles} title={t(language, 'prediction')}>
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <div className="rounded-[0.85rem] border border-outline-variant bg-surface-container-low p-2.5">
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-secondary">{t(language, 'shortTermImpact')}</p>
                  <p className={`mt-1.5 text-on-surface-variant ${isCompact ? 'text-[0.74rem] leading-5' : 'text-[0.78rem] leading-5'}`}>
                    {translateCachedText(language, contentTranslations, selectedEvent.prediction.short_term)}
                  </p>
                </div>
                <div className="rounded-[0.85rem] border border-outline-variant bg-surface-container-low p-2.5">
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-secondary">{t(language, 'longTermImpact')}</p>
                  <p className={`mt-1.5 text-on-surface-variant ${isCompact ? 'text-[0.74rem] leading-5' : 'text-[0.78rem] leading-5'}`}>
                    {translateCachedText(language, contentTranslations, selectedEvent.prediction.long_term)}
                  </p>
                </div>
                <div className="rounded-[0.85rem] border border-primary/15 bg-primary/10 p-2.5 md:min-w-[118px]">
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-secondary">{t(language, 'confidenceLevel')}</p>
                  <p className="mt-1.5 inline-flex rounded-full bg-white px-2.5 py-1 text-[0.76rem] font-semibold capitalize text-primary shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                    {translateLabel(language, selectedEvent.prediction.confidence)}
                  </p>
                </div>
              </div>
            </DetailSection>
          ) : null}
        </div>
      </div>

      <footer className="border-t border-outline-variant bg-white px-4 py-2.5 text-[0.74rem] text-secondary md:px-4">
        {showSourceMetadata
          ? lastScanMeta?.fromFallback
            ? t(language, 'fallbackMode', { reason: fallbackReason })
            : t(language, 'aiStatusWithSource', { provider: aiProvider, source: sourceLabel })
          : t(language, 'aiStatusOnly', { provider: aiProvider })}
      </footer>
    </aside>
  );
}
