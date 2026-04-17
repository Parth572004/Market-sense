import { create } from 'zustand';
import { fetchConfig, fetchDebug, fetchGeoInsights, quickScan } from '../services/api.js';

export const useMarketStore = create((set, get) => ({
  events: [],
  geoInsights: null,
  config: null,
  selectedEventId: null,
  selectedRegion: 'Global',
  selectedCategory: 'all',
  scope: 'Global Macro',
  focus: '',
  explainMode: 'normal',
  demoMode: false,
  debugOpen: false,
  debugData: null,
  loading: false,
  scanning: false,
  error: null,
  lastScanMeta: null,
  modalOpen: false,

  get selectedEvent() {
    const state = get();
    return state.events.find((event) => event.id === state.selectedEventId) || state.events[0] || null;
  },

  setModalOpen: (modalOpen) => set({ modalOpen }),
  setSelectedEvent: (eventId) => set({ selectedEventId: eventId }),
  setExplainMode: (explainMode) => set({ explainMode }),
  setDebugOpen: async (debugOpen) => {
    set({ debugOpen });
    if (debugOpen) {
      await get().refreshDebug();
    }
  },
  setFilters: (filters) => set(filters),
  toggleDemoMode: async () => {
    const nextDemoMode = !get().demoMode;
    set({ demoMode: nextDemoMode });
    await get().runScan({
      demoMode: nextDemoMode,
      provider: nextDemoMode ? 'demo' : 'auto',
      region: 'Global'
    });
  },

  initialize: async () => {
    set({ loading: true, error: null });
    try {
      const config = await fetchConfig();
      set({ config });
      await get().runScan({ provider: 'auto', limit: 10 });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message || 'Unable to initialize dashboard.' });
    } finally {
      set({ loading: false });
    }
  },

  runScan: async (overrides = {}) => {
    const state = get();
    const payload = {
      scope: overrides.scope ?? state.scope,
      focus: overrides.focus ?? state.focus,
      region: overrides.region ?? state.selectedRegion,
      category: overrides.category ?? state.selectedCategory,
      provider: overrides.provider ?? 'auto',
      demoMode: overrides.demoMode ?? state.demoMode,
      explainMode: overrides.explainMode ?? state.explainMode,
      limit: overrides.limit ?? 10
    };

    set({
      scanning: true,
      error: null,
      scope: payload.scope,
      focus: payload.focus,
      selectedRegion: payload.region,
      selectedCategory: payload.category,
      demoMode: payload.demoMode,
      explainMode: payload.explainMode
    });

    try {
      const result = await quickScan(payload);
      const selectedEventId = result.events[0]?.id || null;
      const geoInsights = await fetchGeoInsights({ region: payload.region, demoMode: payload.demoMode });

      set({
        events: result.events,
        geoInsights,
        selectedEventId,
        lastScanMeta: {
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
      if (get().debugOpen) await get().refreshDebug();
    } catch (error) {
      set({ error: error.response?.data?.message || error.message || 'Quick scan failed.' });
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
