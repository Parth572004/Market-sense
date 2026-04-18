import { useMarketStore } from '../store/useMarketStore.js';
import { t } from '../utils/translations.js';

export function LoadingOverlay({ scanning }) {
  const language = useMarketStore((state) => state.preferences.language);

  return (
    <div className="fixed inset-0 z-[1400] isolate flex items-center justify-center bg-slate-950/42 p-6 backdrop-blur-xl">
      <div className="relative z-[1401] flex w-full max-w-[34rem] flex-col items-center gap-6 rounded-[2rem] border border-white/50 bg-white/94 px-8 py-10 text-center shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-outline-variant bg-white/90 shadow-[0_20px_44px_rgba(15,23,42,0.08)]">
          <div className="scan-sweep absolute inset-5 rounded-full" />
          <div className="absolute inset-12 overflow-hidden rounded-full border border-outline-variant bg-surface-container-low shadow-[inset_0_0_36px_rgba(13,148,136,0.08)] relative">
            <div
              className="scan-line"
              style={{
                left: '4%',
                right: '4%',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.28), rgba(20,184,166,1), rgba(34,211,238,0.9), rgba(20,184,166,1), rgba(20,184,166,0.28), transparent)',
                boxShadow: '0 0 14px rgba(20,184,166,0.7), 0 0 28px rgba(34,211,238,0.32)',
                animationDuration: '1.35s'
              }}
            />
          </div>
          <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-[0_0_45px_rgba(13,148,136,0.3)]" />
        </div>
        <div>
          <h2 className="font-headline text-[1.9rem] font-bold text-on-surface">
            {scanning ? t(language, 'scanningGlobalSignals') : t(language, 'recalibratingIntelligence')}
          </h2>
          <p className="mt-2 text-[0.95rem] uppercase tracking-[0.2em] text-secondary">
            {t(language, 'syncingMarketContext')}
          </p>
          <p className="mt-4 text-[0.92rem] font-medium text-secondary">
            Minimum display time: 2.5 seconds
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {[0, 1, 2, 3].map((item) => (
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-primary"
                key={item}
                style={{ animationDelay: `${item * 140}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
