import { Clock3, MapPin } from 'lucide-react';
import { formatNewsTimestamp } from '../utils/formatDate.js';
import { EMPTY_TRANSLATIONS, translateCachedText, translateLabel } from '../utils/translations.js';

export function EventCard({
  event = null,
  active = false,
  onSelect = () => {},
  isCompact = false,
  language = 'en',
  contentTranslations = EMPTY_TRANSLATIONS
}) {
  if (!event || typeof event !== 'object') return null;

  const title = translateCachedText(language, contentTranslations, event.title)
    || translateCachedText(language, contentTranslations, event.summary)
    || translateCachedText(language, contentTranslations, event.what_happened);
  const region = translateCachedText(language, contentTranslations, event.region)
    || translateLabel(language, event.region);

  if (!title) return null;

  return (
    <button
      className={`${isCompact ? 'w-[12.75rem] p-3' : 'w-[13.75rem] p-3.5'} shrink-0 rounded-[1.2rem] border bg-white text-left shadow-[0_14px_28px_rgba(15,23,42,0.07)] transition-all hover:-translate-y-0.5 ${
        active ? 'border-primary/25 shadow-[0_18px_36px_rgba(13,148,136,0.16)]' : 'border-outline-variant'
      }`}
      onClick={onSelect}
      type="button"
    >
      <h3 className={`line-clamp-3 font-headline font-bold text-on-surface ${isCompact ? 'text-[0.84rem] leading-5' : 'text-[0.9rem] leading-5'}`}>
        {title}
      </h3>
      <div className={`mt-2.5 space-y-1.5 font-semibold text-secondary ${isCompact ? 'text-[0.7rem]' : 'text-[0.75rem]'}`}>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">{region}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{formatNewsTimestamp(event.published_at, language)}</span>
        </div>
      </div>
    </button>
  );
}
