import { AlertTriangle, Clock3, MapPin } from 'lucide-react';
import { formatCategory, getCategoryColor } from '../utils/categoryColors.js';
import { formatRelativeDate } from '../utils/formatDate.js';

export function EventCard({ event, active, onSelect }) {
  return (
    <button
      className={`w-80 shrink-0 rounded-xl p-4 text-left transition-all hover:-translate-y-1 ${
        active ? 'glass-panel ghost-border shadow-glow' : 'glass-panel ghost-border'
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="mb-3 flex items-center gap-2">
        {event.priority === 'high' ? (
          <AlertTriangle className="h-4 w-4 text-error" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />
        )}
        <span className={`rounded-xl px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider ${getCategoryColor(event.category)}`}>
          {event.category_label || formatCategory(event.category)}
        </span>
        <span className="ml-auto flex items-center gap-1 text-[11px] text-secondary/70">
          <Clock3 className="h-3 w-3" />
          {formatRelativeDate(event.published_at)}
        </span>
      </div>
      <h3 className="line-clamp-2 font-headline text-sm font-bold leading-snug text-on-surface">
        {event.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
        {event.what_happened || event.summary}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-secondary">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {event.region}
      </div>
    </button>
  );
}
