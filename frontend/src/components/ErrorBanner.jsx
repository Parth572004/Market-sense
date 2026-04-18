import { AlertTriangle } from 'lucide-react';
import { useMarketStore } from '../store/useMarketStore.js';
import { EMPTY_TRANSLATIONS, translateCachedText } from '../utils/translations.js';

export function ErrorBanner({ error }) {
  const language = useMarketStore((state) => state.preferences.language);
  const translationCache = useMarketStore((state) => state.contentTranslations);
  const contentTranslations = translationCache[language] || EMPTY_TRANSLATIONS;

  if (!error) return null;

  return (
    <div className="z-[80] flex shrink-0 items-center gap-3 rounded-[1.4rem] border border-error/20 bg-white/95 p-4 text-[0.95rem] text-error shadow-[0_18px_40px_rgba(239,68,68,0.08)] backdrop-blur-md">
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <span>{translateCachedText(language, contentTranslations, error)}</span>
    </div>
  );
}
