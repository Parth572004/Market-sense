import {
  Eye,
  Gauge,
  LayoutPanelTop,
  RefreshCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore.js';
import { t, translateLabel } from '../utils/translations.js';

const newsLimitOptions = [6, 8, 10];

function OptionGrid({ value, options, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {options.map((option) => {
        const active = value === option.id || value === option.value;

        return (
          <button
            className={`rounded-2xl border p-4 text-left transition-colors ${
              active
                ? 'border-primary/25 bg-primary/10 text-on-surface shadow-[0_14px_28px_rgba(13,148,136,0.14)]'
                : 'border-outline-variant bg-white text-secondary hover:border-primary/20 hover:text-on-surface'
            }`}
            key={option.id || option.value}
            onClick={() => onChange(option.id ?? option.value)}
            type="button"
          >
            <div className="text-[0.92rem] font-bold">{option.label}</div>
            <div className="mt-1 text-[0.8rem] leading-6 text-secondary">{option.note}</div>
          </button>
        );
      })}
    </div>
  );
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-[1.75rem] border border-outline-variant bg-white p-5 shadow-[0_18px_34px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-2xl bg-primary/10 p-2 text-primary">
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div>
          <h3 className="font-headline text-[1.1rem] font-bold text-on-surface">{title}</h3>
          <p className="mt-1 text-[0.88rem] leading-6 text-secondary">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3">
      <div>
        <div className="text-[0.92rem] font-semibold text-on-surface">{title}</div>
        <div className="mt-1 text-[0.8rem] leading-6 text-secondary">{description}</div>
      </div>
      <button
        aria-pressed={checked}
        className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-slate-300'
        }`}
        onClick={(event) => {
          event.preventDefault();
          onChange(!checked);
        }}
        type="button"
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-[0_6px_16px_rgba(15,23,42,0.2)] transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

export function SettingsPanel() {
  const preferences = useMarketStore((state) => state.preferences);
  const activeFeedKind = useMarketStore((state) => state.activeFeedKind);
  const activeFilterLabel = useMarketStore((state) => state.activeFilterLabel);
  const debugOpen = useMarketStore((state) => state.debugOpen);
  const setDebugOpen = useMarketStore((state) => state.setDebugOpen);
  const setSettingsOpen = useMarketStore((state) => state.setSettingsOpen);
  const updatePreferences = useMarketStore((state) => state.updatePreferences);
  const resetPreferences = useMarketStore((state) => state.resetPreferences);
  const applyPreferredView = useMarketStore((state) => state.applyPreferredView);
  const refreshCurrentFeed = useMarketStore((state) => state.refreshCurrentFeed);
  const language = preferences.language;

  const defaultViewOptions = [
    { id: 'market-global', label: t(language, 'defaultViewGlobalMarket'), note: t(language, 'defaultViewGlobalMarketNote') },
    { id: 'market-india', label: t(language, 'defaultViewIndiaMarket'), note: t(language, 'defaultViewIndiaMarketNote') },
    { id: 'market-us', label: t(language, 'defaultViewUsMarket'), note: t(language, 'defaultViewUsMarketNote') },
    { id: 'startup-global', label: t(language, 'defaultViewStartupGlobal'), note: t(language, 'defaultViewStartupGlobalNote') },
    { id: 'startup-india', label: t(language, 'defaultViewStartupIndia'), note: t(language, 'defaultViewStartupIndiaNote') }
  ];

  const refreshOptions = [
    { value: 0, label: t(language, 'refreshManual'), note: t(language, 'refreshManualNote') },
    { value: 5, label: t(language, 'refreshEveryFive'), note: t(language, 'refreshEveryFiveNote') },
    { value: 15, label: t(language, 'refreshEveryFifteen'), note: t(language, 'refreshEveryFifteenNote') }
  ];

  const densityOptions = [
    { id: 'compact', label: t(language, 'densityCompact'), note: t(language, 'densityCompactNote') },
    { id: 'comfortable', label: t(language, 'densityComfortable'), note: t(language, 'densityComfortableNote') }
  ];

  const detailWidthOptions = [
    { id: 'standard', label: t(language, 'detailWidthStandard'), note: t(language, 'detailWidthStandardNote') },
    { id: 'wide', label: t(language, 'detailWidthWide'), note: t(language, 'detailWidthWideNote') }
  ];

  const autoRefreshLabel = preferences.autoRefreshMinutes === 5
    ? t(language, 'refreshEveryFive')
    : preferences.autoRefreshMinutes === 15
      ? t(language, 'refreshEveryFifteen')
      : t(language, 'manualRefresh');
  const densityLabel = preferences.cardDensity === 'compact' ? t(language, 'densityCompact') : t(language, 'densityComfortable');
  const detailPanelLabel = preferences.detailPanelWidth === 'wide' ? t(language, 'detailWidthWide') : t(language, 'detailWidthStandard');
  const workspaceLabel = activeFeedKind === 'startup' ? t(language, 'startupWorkspace') : t(language, 'marketWorkspace');

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/25 backdrop-blur-sm">
      <div className="absolute inset-4 overflow-hidden rounded-[2rem] border border-outline-variant bg-[#f8fafc] shadow-[0_28px_60px_rgba(15,23,42,0.18)]">
        <div className="grid h-full lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="border-b border-outline-variant bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] p-6 text-white lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-slate-200">
                <Settings2 className="h-3.5 w-3.5" />
                {t(language, 'personalSettings')}
              </div>
              <button
                className="rounded-2xl p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setSettingsOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8">
              <h2 className="font-headline text-[2rem] font-bold leading-tight">
                {t(language, 'settingsTitle')}
              </h2>
              <p className="mt-3 text-[0.95rem] leading-7 text-slate-300">
                {t(language, 'settingsDescription')}
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-300">{t(language, 'currentFeed')}</div>
                <div className="mt-2 text-[1.05rem] font-semibold">{translateLabel(language, activeFilterLabel)}</div>
                <div className="mt-1 text-[0.82rem] text-slate-300">{workspaceLabel}</div>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-300">{t(language, 'automation')}</div>
                <div className="mt-2 text-[1.05rem] font-semibold">
                  {autoRefreshLabel}
                </div>
                <div className="mt-1 text-[0.82rem] text-slate-300">
                  {preferences.reduceMotion ? t(language, 'reducedMotionEnabled') : t(language, 'motionCuesEnabled')}
                </div>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-300">{t(language, 'readingSetup')}</div>
                <div className="mt-2 text-[1.05rem] font-semibold">{t(language, 'densityLabel', { value: densityLabel })}</div>
                <div className="mt-1 text-[0.82rem] text-slate-300">{t(language, 'detailPanelLabel', { value: detailPanelLabel })}</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="rounded-2xl bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                onClick={applyPreferredView}
                type="button"
              >
                {t(language, 'applyPreferredView')}
              </button>
              <button
                className="rounded-2xl border border-white/15 px-4 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-white/10"
                onClick={() => {
                  resetPreferences();
                  refreshCurrentFeed();
                }}
                type="button"
              >
                {t(language, 'resetDefaults')}
              </button>
            </div>
          </aside>

          <div className="hide-scrollbar overflow-y-auto p-5 lg:p-6">
            <div className="grid gap-5 xl:grid-cols-2">
              <Section
                description={t(language, 'landingViewDescription')}
                icon={LayoutPanelTop}
                title={t(language, 'landingView')}
              >
                <OptionGrid
                  onChange={(value) => updatePreferences({ defaultView: value })}
                  options={defaultViewOptions}
                  value={preferences.defaultView}
                />
              </Section>

              <Section
                description={t(language, 'autoRefreshDescription')}
                icon={RefreshCcw}
                title={t(language, 'autoRefresh')}
              >
                <OptionGrid
                  onChange={(value) => updatePreferences({ autoRefreshMinutes: value })}
                  options={refreshOptions}
                  value={preferences.autoRefreshMinutes}
                />
              </Section>

              <Section
                description={t(language, 'readingComfortDescription')}
                icon={Gauge}
                title={t(language, 'readingComfort')}
              >
                <div className="space-y-4">
                  <OptionGrid
                    onChange={(value) => updatePreferences({ cardDensity: value })}
                    options={densityOptions}
                    value={preferences.cardDensity}
                  />
                  <OptionGrid
                    onChange={(value) => updatePreferences({ detailPanelWidth: value })}
                    options={detailWidthOptions}
                    value={preferences.detailPanelWidth}
                  />
                </div>
              </Section>

              <Section
                description={t(language, 'contentPresentationDescription')}
                icon={Eye}
                title={t(language, 'contentPresentation')}
              >
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-secondary">{t(language, 'itemsPerScan')}</div>
                    <div className="flex flex-wrap gap-2">
                      {newsLimitOptions.map((limit) => (
                        <button
                          className={`rounded-full border px-3 py-2 text-[0.85rem] font-semibold transition-colors ${
                            preferences.newsLimit === limit
                              ? 'border-primary/20 bg-primary/10 text-primary'
                              : 'border-outline-variant bg-white text-secondary hover:border-primary/20 hover:text-on-surface'
                          }`}
                          key={limit}
                          onClick={() => {
                            updatePreferences({ newsLimit: limit });
                            refreshCurrentFeed();
                          }}
                          type="button"
                        >
                          {t(language, 'storiesLabel', { count: limit })}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ToggleRow
                    checked={preferences.showSourceMetadata}
                    description={t(language, 'showSourceMetadataDescription')}
                    onChange={(checked) => updatePreferences({ showSourceMetadata: checked })}
                    title={t(language, 'showSourceMetadata')}
                  />
                </div>
              </Section>

              <Section
                description={t(language, 'motionFocusDescription')}
                icon={Sparkles}
                title={t(language, 'motionFocus')}
              >
                <ToggleRow
                  checked={preferences.reduceMotion}
                  description={t(language, 'reduceMotionDescription')}
                  onChange={(checked) => updatePreferences({ reduceMotion: checked })}
                  title={t(language, 'reduceMotion')}
                />
              </Section>

              <Section
                description={t(language, 'diagnosticsDescription')}
                icon={ShieldCheck}
                title={t(language, 'diagnostics')}
              >
                <div className="space-y-4">
                  <ToggleRow
                    checked={debugOpen}
                    description={t(language, 'diagnosticsPanelDescription')}
                    onChange={(checked) => setDebugOpen(checked)}
                    title={t(language, 'diagnosticsPanel')}
                  />
                  <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                    <div className="flex items-center gap-2 text-[0.92rem] font-semibold text-on-surface">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {t(language, 'workspaceActions')}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        className="rounded-xl border border-outline-variant bg-white px-3 py-2 text-[0.82rem] font-semibold text-secondary transition-colors hover:border-primary/20 hover:text-on-surface"
                        onClick={refreshCurrentFeed}
                        type="button"
                      >
                        {t(language, 'refreshCurrentFeed')}
                      </button>
                      <button
                        className="rounded-xl border border-outline-variant bg-white px-3 py-2 text-[0.82rem] font-semibold text-secondary transition-colors hover:border-primary/20 hover:text-on-surface"
                        onClick={applyPreferredView}
                        type="button"
                      >
                        {t(language, 'jumpToPreferredView')}
                      </button>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
