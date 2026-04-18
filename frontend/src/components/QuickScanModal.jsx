import { X } from 'lucide-react';
import { useState } from 'react';
import { useMarketStore } from '../store/useMarketStore.js';
import { t, translateLabel } from '../utils/translations.js';

const scopes = ['Global Macro', 'US Equities', 'Indian Markets', 'Emerging Markets'];

export function QuickScanModal() {
  const currentScope = useMarketStore((state) => state.scope);
  const currentFocus = useMarketStore((state) => state.focus);
  const runScan = useMarketStore((state) => state.runScan);
  const setModalOpen = useMarketStore((state) => state.setModalOpen);
  const scanning = useMarketStore((state) => state.scanning);
  const language = useMarketStore((state) => state.preferences.language);
  const [scope, setScope] = useState(currentScope);
  const [focus, setFocus] = useState(currentFocus);

  const submit = (event) => {
    event.preventDefault();
    runScan({ scope, focus });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/12 p-4 backdrop-blur-sm">
      <form
        className="w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/12 bg-[linear-gradient(155deg,rgba(2,6,23,0.96),rgba(15,23,42,0.94)_40%,rgba(15,118,110,0.88)_100%)] shadow-[0_28px_80px_rgba(2,6,23,0.38)]"
        onSubmit={submit}
      >
        <header className="flex items-center justify-between border-b border-white/10 bg-white/5 p-6">
          <div>
            <h2 className="font-headline text-[1.55rem] font-bold text-white">{t(language, 'configureQuickScan')}</h2>
            <p className="mt-2 text-[0.95rem] text-white/72">
              {t(language, 'quickScanDescription')}
            </p>
          </div>
          <button
            aria-label={t(language, 'cancel')}
            className="rounded-2xl p-3 text-white/72 transition-colors hover:bg-white/10 hover:text-white"
            onClick={() => setModalOpen(false)}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-7 p-6">
          <div>
            <label className="mb-4 block text-[1rem] font-bold text-white">{t(language, 'scanScope')}</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {scopes.map((option) => (
                <button
                  className={`rounded-2xl border px-4 py-4 text-[0.98rem] font-semibold transition-colors ${
                    scope === option
                      ? 'border-primary/30 bg-primary/20 text-white shadow-[0_12px_28px_rgba(13,148,136,0.2)]'
                      : 'border-white/12 bg-white/5 text-white hover:border-primary/30 hover:bg-white/8 hover:text-white'
                  }`}
                  key={option}
                  onClick={() => setScope(option)}
                  type="button"
                >
                  {translateLabel(language, option)}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-3 block text-[1rem] font-bold text-white">{t(language, 'focusArea')}</span>
            <input
              className="w-full rounded-2xl border border-white/12 bg-transparent px-5 py-4 text-[1rem] text-white outline-none placeholder:text-white/45 focus:border-primary"
              onChange={(event) => setFocus(event.target.value)}
              placeholder={t(language, 'focusPlaceholder')}
              value={focus}
            />
          </label>
        </div>

        <footer className="flex justify-end gap-3 p-6 pt-0">
          <button
            className="rounded-2xl px-5 py-3 text-[0.95rem] font-semibold text-white/82 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => setModalOpen(false)}
            type="button"
          >
            {t(language, 'cancel')}
          </button>
          <button
            className="btn-gradient rounded-2xl px-7 py-3 text-[0.98rem] font-extrabold shadow-glow transition-transform active:scale-95 disabled:opacity-70"
            disabled={scanning}
            type="submit"
          >
            {scanning ? t(language, 'scanning') : t(language, 'initiateScan')}
          </button>
        </footer>
      </form>
    </div>
  );
}
