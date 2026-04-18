import { create } from 'zustand';
import { fetchConfig, fetchDebug, fetchStartupInsights, quickScan, translateBatch } from '../services/api.js';
import {
  collectEventTexts,
  getLabelTranslationEntries,
  getUiTranslationEntries,
  registerLabelTranslations,
  registerUiTranslations
} from '../utils/translations.js';

const SETTINGS_STORAGE_KEY = 'market-sense-settings';
const DASHBOARD_STORAGE_KEY = 'market-sense-dashboard';

const DEFAULT_PREFERENCES = {
  defaultView: 'market-global',
  autoRefreshMinutes: 0,
  cardDensity: 'comfortable',
  newsLimit: 8,
  detailPanelWidth: 'standard',
  reduceMotion: true,
  showSourceMetadata: true,
  language: 'en'
};

const MIN_SCAN_DURATION_MS = 2500;
const UI_TRANSLATION_CHUNK_SIZE = 60;
const DEFAULT_DASHBOARD_STATE = {
  events: [],
  selectedEventId: null,
  scope: 'Global Macro',
  focus: '',
  activeRegion: 'Global',
  activeFeedKind: 'market',
  activeFilterLabel: 'Global',
  lastScanMeta: null
};

function readStoredPreferences() {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return DEFAULT_PREFERENCES;
    }

    return {
      ...DEFAULT_PREFERENCES,
      ...parsed
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function persistPreferences(preferences) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Ignore persistence failures and keep the session usable.
  }
}

function readStoredDashboard() {
  if (typeof window === 'undefined') return DEFAULT_DASHBOARD_STATE;

  try {
    const raw = window.localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (!raw) return DEFAULT_DASHBOARD_STATE;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return DEFAULT_DASHBOARD_STATE;
    }

    return {
      ...DEFAULT_DASHBOARD_STATE,
      events: prepareRenderableEvents(Array.isArray(parsed?.events) ? parsed.events : []),
      selectedEventId: typeof parsed.selectedEventId === 'string' ? parsed.selectedEventId : null,
      scope: typeof parsed.scope === 'string' ? parsed.scope : DEFAULT_DASHBOARD_STATE.scope,
      focus: typeof parsed.focus === 'string' ? parsed.focus : DEFAULT_DASHBOARD_STATE.focus,
      activeRegion: typeof parsed.activeRegion === 'string' ? parsed.activeRegion : DEFAULT_DASHBOARD_STATE.activeRegion,
      activeFeedKind: parsed.activeFeedKind === 'startup' ? 'startup' : 'market',
      activeFilterLabel: typeof parsed.activeFilterLabel === 'string' ? parsed.activeFilterLabel : DEFAULT_DASHBOARD_STATE.activeFilterLabel,
      lastScanMeta: parsed.lastScanMeta && typeof parsed.lastScanMeta === 'object' ? parsed.lastScanMeta : null
    };
  } catch {
    return DEFAULT_DASHBOARD_STATE;
  }
}

function persistDashboard(state) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify({
      events: state.events || [],
      selectedEventId: state.selectedEventId || null,
      scope: state.scope || DEFAULT_DASHBOARD_STATE.scope,
      focus: state.focus || DEFAULT_DASHBOARD_STATE.focus,
      activeRegion: state.activeRegion || DEFAULT_DASHBOARD_STATE.activeRegion,
      activeFeedKind: state.activeFeedKind || DEFAULT_DASHBOARD_STATE.activeFeedKind,
      activeFilterLabel: state.activeFilterLabel || DEFAULT_DASHBOARD_STATE.activeFilterLabel,
      lastScanMeta: state.lastScanMeta || null
    }));
  } catch {
    // Ignore persistence failures and keep the session usable.
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function hasVisibleText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function prepareRenderableEvents(events = []) {
  const sourceEvents = Array.isArray(events) ? events : [];

  return sourceEvents
    .map((event) => {
      if (!event || typeof event !== 'object') return null;

      const title = hasVisibleText(event.title)
        ? event.title.trim()
        : [event.summary, event.what_happened, event.why_it_matters].find(hasVisibleText)?.trim() || '';
      const summary = hasVisibleText(event.summary)
        ? event.summary.trim()
        : [event.what_happened, event.why_it_matters, title].find(hasVisibleText)?.trim() || '';

      if (!title && !summary) return null;

      return {
        ...event,
        title,
        summary
      };
    })
    .filter(Boolean);
}

function scopeForRegion(region = 'Global') {
  if (region === 'India') return 'Indian Markets';
  if (region === 'US') return 'US Equities';
  return 'Global Macro';
}

function viewConfigForPreference(view = 'market-global') {
  switch (view) {
    case 'market-india':
      return { type: 'market', region: 'India', label: 'India' };
    case 'market-us':
      return { type: 'market', region: 'US', label: 'US' };
    case 'startup-global':
      return { type: 'startup', region: 'Global', label: 'Startup Global' };
    case 'startup-india':
      return { type: 'startup', region: 'India', label: 'Startup India' };
    case 'market-global':
    default:
      return { type: 'market', region: 'Global', label: 'Global' };
  }
}

const INITIAL_DASHBOARD_STATE = readStoredDashboard();

export const useMarketStore = create((set, get) => ({
  config: null,
  preferences: readStoredPreferences(),
  contentTranslations: {},
  uiTranslationsReady: {
    en: true,
    hi: true
  },
  translationPending: 0,
  settingsOpen: false,
  events: INITIAL_DASHBOARD_STATE.events,
  selectedEventId: INITIAL_DASHBOARD_STATE.selectedEventId,
  scope: INITIAL_DASHBOARD_STATE.scope,
  focus: INITIAL_DASHBOARD_STATE.focus,
  activeRegion: INITIAL_DASHBOARD_STATE.activeRegion,
  activeFeedKind: INITIAL_DASHBOARD_STATE.activeFeedKind,
  activeFilterLabel: INITIAL_DASHBOARD_STATE.activeFilterLabel,
  debugOpen: false,
  debugData: null,
  loading: true,
  scanning: false,
  error: null,
  lastScanMeta: INITIAL_DASHBOARD_STATE.lastScanMeta,
  modalOpen: false,

  get selectedEvent() {
    const state = get();
    return state.events.find((event) => event.id === state.selectedEventId) || state.events[0] || null;
  },

  setModalOpen: (modalOpen) => set({ modalOpen }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setSelectedEvent: (eventId) => set((state) => {
    const nextState = { selectedEventId: eventId };
    persistDashboard({ ...state, ...nextState });
    return nextState;
  }),
  setLanguage: async (language) => {
    const preferences = {
      ...get().preferences,
      language
    };
    persistPreferences(preferences);
    set({ preferences });

    if (language !== 'en') {
      const state = get();
      await Promise.all([
        state.hydrateUiTranslations(language),
        state.hydrateTranslations([
          ...collectEventTexts(state.events),
          state.error,
          state.lastScanMeta?.fallbackReason
        ], language)
      ]);
    }
  },
  setDebugOpen: async (debugOpen) => {
    set({ debugOpen });
    if (debugOpen) {
      await get().refreshDebug();
    }
  },
  updatePreferences: (partial) => set((state) => {
    const preferences = {
      ...state.preferences,
      ...partial
    };
    persistPreferences(preferences);
    return { preferences };
  }),
  resetPreferences: () => {
    persistPreferences(DEFAULT_PREFERENCES);
    set({ preferences: DEFAULT_PREFERENCES, debugOpen: false });
  },
  hydrateTranslations: async (texts = [], language = get().preferences.language) => {
    if (language === 'en') return;

    const trimmedTexts = [...new Set(
      texts
        .filter((text) => typeof text === 'string')
        .map((text) => text.trim())
        .filter(Boolean)
    )];

    if (!trimmedTexts.length) return;

    const cachedTranslations = get().contentTranslations[language] || {};
    const missingTexts = trimmedTexts.filter((text) => !cachedTranslations[text]);

    if (!missingTexts.length) return;

    set((state) => ({ translationPending: state.translationPending + 1 }));

    try {
      const result = await translateBatch({
        texts: missingTexts,
        targetLanguage: language,
        sourceLanguage: 'auto'
      });

      set((state) => ({
        contentTranslations: {
          ...state.contentTranslations,
          [language]: {
            ...(state.contentTranslations[language] || {}),
            ...(result.translations || {})
          }
        }
      }));
    } catch {
      // Keep the dashboard usable in English if the translation service is unavailable.
    } finally {
      set((state) => ({ translationPending: Math.max(0, state.translationPending - 1) }));
    }
  },
  hydrateUiTranslations: async (language = get().preferences.language) => {
    if (language === 'en' || get().uiTranslationsReady[language]) return;

    const entries = getUiTranslationEntries();
    const labelEntries = getLabelTranslationEntries();
    if (!entries.length && !labelEntries.length) {
      set((state) => ({
        uiTranslationsReady: {
          ...state.uiTranslationsReady,
          [language]: true
        }
      }));
      return;
    }

    set((state) => ({ translationPending: state.translationPending + 1 }));

    try {
      const keyTranslations = {};
      const labelTranslations = {};

      for (let index = 0; index < entries.length; index += UI_TRANSLATION_CHUNK_SIZE) {
        const chunk = entries.slice(index, index + UI_TRANSLATION_CHUNK_SIZE);
        const result = await translateBatch({
          texts: chunk.map((entry) => entry.text),
          targetLanguage: language,
          sourceLanguage: 'en'
        });

        chunk.forEach((entry) => {
          keyTranslations[entry.key] = result.translations?.[entry.text] || entry.text;
        });
      }

      for (let index = 0; index < labelEntries.length; index += UI_TRANSLATION_CHUNK_SIZE) {
        const chunk = labelEntries.slice(index, index + UI_TRANSLATION_CHUNK_SIZE);
        const result = await translateBatch({
          texts: chunk,
          targetLanguage: language,
          sourceLanguage: 'en'
        });

        chunk.forEach((entry) => {
          labelTranslations[entry] = result.translations?.[entry] || entry;
        });
      }

      registerUiTranslations(language, keyTranslations);
      registerLabelTranslations(language, labelTranslations);
      set((state) => ({
        uiTranslationsReady: {
          ...state.uiTranslationsReady,
          [language]: true
        }
      }));
    } catch {
      // Fall back to English UI if runtime UI translation is unavailable.
    } finally {
      set((state) => ({ translationPending: Math.max(0, state.translationPending - 1) }));
    }
  },

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const config = await fetchConfig();
      set({ config });
      if (!get().events.length) {
        await get().applyPreferredView();
      }
    } catch (error) {
      set({ error: error.response?.data?.message || error.message || 'Unable to initialize dashboard.' });
    } finally {
      set({ loading: false });
    }
  },

  applyPreferredView: async () => {
    const preference = get().preferences.defaultView;
    const view = viewConfigForPreference(preference);

    if (view.type === 'startup') {
      await get().runStartupInsights({
        region: view.region,
        label: view.label
      });
      return;
    }

    await get().runScan({
      region: view.region,
      label: view.label,
      scope: scopeForRegion(view.region)
    });
  },

  refreshCurrentFeed: async () => {
    const state = get();
    if (state.activeFeedKind === 'startup') {
      await get().runStartupInsights({
        region: state.activeRegion,
        label: state.activeFilterLabel || (state.activeRegion === 'India' ? 'Startup India' : 'Startup Global'),
        forceRefresh: true
      });
      return;
    }

    await get().runScan({
      region: state.activeRegion,
      label: state.activeFilterLabel || state.activeRegion,
      scope: state.scope,
      focus: state.focus,
      forceRefresh: true
    });
  },

  runScan: async (overrides = {}) => {
    const state = get();
    const previousEvents = state.events;
    const previousSelectedEventId = state.selectedEventId;
    const region = overrides.region ?? state.activeRegion ?? 'Global';
    const payload = {
      scope: overrides.scope ?? scopeForRegion(region),
      focus: overrides.focus ?? state.focus,
      region,
      provider: overrides.provider ?? 'auto',
      forceRefresh: Boolean(overrides.forceRefresh),
      limit: overrides.limit ?? state.preferences.newsLimit
    };
    const minimumScanPromise = wait(MIN_SCAN_DURATION_MS);

    set({
      scanning: true,
      error: null,
      scope: payload.scope,
      focus: payload.focus,
      activeRegion: region,
      activeFeedKind: 'market',
      activeFilterLabel: overrides.label ?? region,
      modalOpen: false,
      ...(overrides.forceRefresh ? { events: [], selectedEventId: null } : {})
    });

    try {
      const result = await quickScan(payload);
      await minimumScanPromise;
      const events = prepareRenderableEvents(result.events);

      set({
        events,
        selectedEventId: null,
        lastScanMeta: {
          kind: 'quick_scan',
          region,
          filterLabel: overrides.label ?? region,
          generatedAt: result.generatedAt,
          provider: result.provider,
          fromFallback: result.fromFallback,
          fallbackReason: result.fallbackReason,
          demoMode: result.demoMode,
          processingTimeMs: result.processingTimeMs,
          query: result.query,
          cache: result.cache
        }
      });
      persistDashboard({
        ...get(),
        events,
        selectedEventId: null,
        scope: payload.scope,
        focus: payload.focus,
        activeRegion: region,
        activeFeedKind: 'market',
        activeFilterLabel: overrides.label ?? region,
        lastScanMeta: {
          kind: 'quick_scan',
          region,
          filterLabel: overrides.label ?? region,
          generatedAt: result.generatedAt,
          provider: result.provider,
          fromFallback: result.fromFallback,
          fallbackReason: result.fallbackReason,
          demoMode: result.demoMode,
          processingTimeMs: result.processingTimeMs,
          query: result.query,
          cache: result.cache
        }
      });

      if (get().preferences.language !== 'en') {
        const language = get().preferences.language;
        void get().hydrateUiTranslations(language);
        void get().hydrateTranslations([
          ...collectEventTexts(events),
          result.fallbackReason
        ], language);
      }

      if (get().debugOpen) await get().refreshDebug();
    } catch (error) {
      await minimumScanPromise;
      set({
        error: error.response?.data?.message || error.message || 'Quick scan failed.',
        ...(overrides.forceRefresh ? { events: previousEvents, selectedEventId: previousSelectedEventId } : {})
      });
    } finally {
      set({ scanning: false, modalOpen: false });
    }
  },

  runStartupInsights: async (overrides = {}) => {
    const state = get();
    const previousEvents = state.events;
    const previousSelectedEventId = state.selectedEventId;
    const region = overrides.region ?? state.activeRegion ?? 'Global';

    set({
      scanning: true,
      error: null,
      activeRegion: region,
      activeFeedKind: 'startup',
      activeFilterLabel: overrides.label ?? (region === 'India' ? 'Startup India' : 'Startup Global'),
      modalOpen: false,
      ...(overrides.forceRefresh ? { events: [], selectedEventId: null } : {})
    });
    const minimumScanPromise = wait(MIN_SCAN_DURATION_MS);

    try {
      const result = await fetchStartupInsights({
        region,
        forceRefresh: Boolean(overrides.forceRefresh),
        limit: overrides.limit ?? state.preferences.newsLimit
      });
      await minimumScanPromise;
      const events = prepareRenderableEvents(result.events);

      set({
        events,
        selectedEventId: null,
        lastScanMeta: {
          kind: 'startup_insights',
          region,
          filterLabel: overrides.label ?? (region === 'India' ? 'Startup India' : 'Startup Global'),
          generatedAt: result.generatedAt,
          provider: result.provider,
          fromFallback: result.fromFallback,
          fallbackReason: result.fallbackReason,
          processingTimeMs: result.processingTimeMs,
          query: result.query,
          cache: result.cache
        }
      });
      persistDashboard({
        ...get(),
        events,
        selectedEventId: null,
        activeRegion: region,
        activeFeedKind: 'startup',
        activeFilterLabel: overrides.label ?? (region === 'India' ? 'Startup India' : 'Startup Global'),
        lastScanMeta: {
          kind: 'startup_insights',
          region,
          filterLabel: overrides.label ?? (region === 'India' ? 'Startup India' : 'Startup Global'),
          generatedAt: result.generatedAt,
          provider: result.provider,
          fromFallback: result.fromFallback,
          fallbackReason: result.fallbackReason,
          processingTimeMs: result.processingTimeMs,
          query: result.query,
          cache: result.cache
        }
      });

      if (get().preferences.language !== 'en') {
        const language = get().preferences.language;
        void get().hydrateUiTranslations(language);
        void get().hydrateTranslations([
          ...collectEventTexts(events),
          result.fallbackReason
        ], language);
      }

      if (get().debugOpen) await get().refreshDebug();
    } catch (error) {
      await minimumScanPromise;
      set({
        error: error.response?.data?.message || error.message || 'Startup insights failed.',
        ...(overrides.forceRefresh ? { events: previousEvents, selectedEventId: previousSelectedEventId } : {})
      });
    } finally {
      set({ scanning: false, modalOpen: false });
    }
  },

  refreshDebug: async () => {
    try {
      const debugData = await fetchDebug();
      set({ debugData });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message || 'Unable to load debug panel.' });
    }
  }
}));
