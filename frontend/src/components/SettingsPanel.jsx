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
import { t } from '../utils/translations.js';

const newsLimitOptions = [6, 8, 10];

function OptionGrid({ value, options, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const active = value === option.id || value === option.value;

        return (
          <button
            className={`rounded-2xl border p-4 text-left transition-all ${
              active
                ? 'border-primary/30 bg-primary/5 ring-1 ring-primary/20 shadow-[0_8px_20px_rgba(13,148,136,0.08)]'
                : 'border-outline-variant bg-white hover:border-primary/20 hover:bg-slate-50'
            }`}
            key={option.id || option.value}
            onClick={() => onChange(option.id ?? option.value)}
            type="button"
          >
            <div className={`text-[0.9rem] font-bold ${active ? 'text-primary' : 'text-on-surface'}`}>
              {option.label}
            </div>
            <div className="mt-1 text-[0.78rem] leading-relaxed text-secondary">{option.note}</div>
          </button>
        );
      })}
    </div>
  );
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-headline text-[1.05rem] font-bold text-on-surface">{title}</h3>
          <p className="text-[0.82rem] text-secondary">{description}</p>
        </div>
      </div>
      <div className="rounded-[1.5rem] border border-outline-variant bg-white/50 p-5 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[0.9rem] font-semibold text-on-surface">{title}</div>
        <div className="text-[0.78rem] text-secondary">{description}</div>
      </div>
      <button
        aria-pressed={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-slate-200'
        }`}
        onClick={(event) => {
          event.preventDefault();
          onChange(!checked);
        }}
        type="button"
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

export function SettingsPanel() {
  const preferences = useMarketStore((state) => state.preferences);
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
    { id: 'comfortable', label: t(language, 'densityComfortable'), note: t(language, 'densityComfortableNote') },
    { id: 'compact', label: t(language, 'densityCompact'), note: t(language, 'densityCompactNote') }
  ];

  const detailWidthOptions = [
    { id: 'standard', label: t(language, 'detailWidthStandard'), note: t(language, 'detailWidthStandardNote') },
    { id: 'wide', label: t(language, 'detailWidthWide'), note: t(language, 'detailWidthWideNote') }
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/20 p-4 backdrop-blur-md">
      <div className="flex h-full max-h-[840px] w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] border border-outline-variant bg-[#f8fafc] shadow-[0_40px_100px_rgba(15,23,42,0.25)]">
        <header className="flex items-center justify-between border-b border-outline-variant bg-white px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-slate-900 p-2.5 text-white">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">{t(language, 'personalSettings')}</h2>
              <p className="text-[0.85rem] text-secondary">{t(language, 'settingsDescription')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-2xl border border-outline-variant px-5 py-2.5 text-[0.9rem] font-semibold text-secondary transition-colors hover:bg-slate-50 hover:text-on-surface"
              onClick={() => {
                resetPreferences();
                refreshCurrentFeed();
              }}
              type="button"
            >
              {t(language, 'resetDefaults')}
            </button>
            <button
              className="rounded-2xl bg-slate-900 p-2 text-white transition-transform hover:scale-105 active:scale-95"
              onClick={() => setSettingsOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="hide-scrollbar flex-1 overflow-y-auto p-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-10">
              <Section
                description={t(language, 'landingViewDescription')}
                icon={LayoutPanelTop}
                title={t(language, 'landingView')}
              >
                <OptionGrid
                  onChange={(value) => {
                    updatePreferences({ defaultView: value });
                    applyPreferredView();
                  }}
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
                description={t(language, 'diagnosticsDescription')}
                icon={ShieldCheck}
                title={t(language, 'diagnostics')}
              >
                <ToggleRow
                  checked={debugOpen}
                  description={t(language, 'diagnosticsPanelDescription')}
                  onChange={(checked) => setDebugOpen(checked)}
                  title={t(language, 'diagnosticsPanel')}
                />
              </Section>
            </div>

            <div className="space-y-10">
              <Section
                description={t(language, 'readingComfortDescription')}
                icon={Gauge}
                title={t(language, 'readingComfort')}
              >
                <div className="space-y-6">
                  <div>
                    <div className="mb-3 text-[0.75rem] font-bold uppercase tracking-wider text-secondary">{t(language, 'cardDensity')}</div>
                    <OptionGrid
                      onChange={(value) => updatePreferences({ cardDensity: value })}
                      options={densityOptions}
                      value={preferences.cardDensity}
                    />
                  </div>
                  <div>
                    <div className="mb-3 text-[0.75rem] font-bold uppercase tracking-wider text-secondary">{t(language, 'detailWidth')}</div>
                    <OptionGrid
                      onChange={(value) => updatePreferences({ detailPanelWidth: value })}
                      options={detailWidthOptions}
                      value={preferences.detailPanelWidth}
                    />
                  </div>
                </div>
              </Section>

              <Section
                description={t(language, 'contentPresentationDescription')}
                icon={Eye}
                title={t(language, 'contentPresentation')}
              >
                <div className="space-y-6">
                  <div>
                    <div className="mb-3 text-[0.75rem] font-bold uppercase tracking-wider text-secondary">{t(language, 'itemsPerScan')}</div>
                    <div className="flex flex-wrap gap-2">
                      {newsLimitOptions.map((limit) => (
                        <button
                          className={`rounded-xl border px-4 py-2 text-[0.85rem] font-bold transition-all ${
                            preferences.newsLimit === limit
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-outline-variant bg-white text-secondary hover:border-primary/20 hover:text-on-surface'
                          }`}
                          key={limit}
                          onClick={() => {
                            updatePreferences({ newsLimit: limit });
                            refreshCurrentFeed();
                          }}
                          type="button"
                        >
                          {limit} {t(language, 'stories')}
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
                  <ToggleRow
                    checked={preferences.reduceMotion}
                    description={t(language, 'reduceMotionDescription')}
                    onChange={(checked) => updatePreferences({ reduceMotion: checked })}
                    title={t(language, 'reduceMotion')}
                  />
                </div>
              </Section>
            </div>
          </div>
        </div>

        <footer className="border-t border-outline-variant bg-white/50 px-8 py-4 text-center">
          <p className="text-[0.75rem] font-medium text-secondary">
            Market Sense Intelligence Dashboard &bull; AI-Powered Market Context
          </p>
        </footer>
      </div>
    </div>
  );
}
