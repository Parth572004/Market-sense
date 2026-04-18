import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { darkTileLayer, defaultMapCenter, defaultMapZoom } from '../utils/mapConfig.js';
import { formatCategory } from '../utils/categoryColors.js';
import { EMPTY_TRANSLATIONS, translateCachedText, translateLabel } from '../utils/translations.js';

function createPulseIcon(event, selected, index) {
  const priorityClass = event.priority === 'high' ? 'priority-high' : 'priority-medium';
  const selectedClass = selected ? 'scale-[1.25]' : '';
  const delay = Math.min(index * 90, 720);

  return L.divIcon({
    className: '',
    html: `<div class="pulse-marker marker-appear ${priorityClass} ${selectedClass}" style="animation-delay:${delay}ms"><span class="pulse-core"></span></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10]
  });
}

function MapNavigator({ selectedEvent }) {
  const map = useMap();

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      map.attributionControl?.setPrefix(false);
      map.invalidateSize(false);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [map]);

  useEffect(() => {
    if (selectedEvent) {
      map.invalidateSize(false);
      map.setView([selectedEvent.lat, selectedEvent.lng], Math.max(selectedEvent.zoom || 4, 4), {
        animate: false
      });
      return;
    }

    map.invalidateSize(false);
    map.setView(defaultMapCenter, defaultMapZoom, { animate: false });
  }, [map, selectedEvent]);

  return null;
}

export function MarketMap({
  events = [],
  selectedEventId = null,
  onSelectEvent = () => {},
  showSourceMetadata = true,
  language = 'en',
  contentTranslations = EMPTY_TRANSLATIONS
}) {
  const safeEvents = Array.isArray(events) ? events : [];
  const selectedEvent = useMemo(
    () => safeEvents.find((event) => event.id === selectedEventId) || null,
    [safeEvents, selectedEventId]
  );

  return (
    <main id="global-pulse" className="relative h-full w-full overflow-hidden">
      <MapContainer
        className="h-full w-full"
        center={defaultMapCenter}
        maxZoom={8}
        minZoom={2}
        scrollWheelZoom
        zoom={defaultMapZoom}
        zoomControl
      >
        <TileLayer attribution={darkTileLayer.attribution} url={darkTileLayer.url} />
        <MapNavigator selectedEvent={selectedEvent} />
        {selectedEvent && (
          <Circle
            center={[selectedEvent.lat, selectedEvent.lng]}
            pathOptions={{ color: '#0f766e', fillColor: '#0f766e', fillOpacity: 0.12, weight: 1.2 }}
            radius={900000}
          />
        )}
        {safeEvents.map((event, index) => (
          <Marker
            eventHandlers={{ click: () => onSelectEvent(event.id) }}
            icon={createPulseIcon(event, selectedEventId === event.id, index)}
            key={event.id}
            position={[event.lat, event.lng]}
          >
            <Popup>
              <div className="max-w-[220px] text-slate-900">
                <strong>{translateCachedText(language, contentTranslations, event.title)}</strong>
                <p>
                  {translateCachedText(language, contentTranslations, event.region) || translateLabel(language, event.region)}
                  {' | '}
                  {translateCachedText(language, contentTranslations, event.category_label)
                    || translateLabel(language, event.category_label)
                    || formatCategory(event.category, language)}
                </p>
                {showSourceMetadata && event.source ? (
                  <p className="mt-1 text-[0.78rem] text-slate-500">{event.source}</p>
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.04)_48%,rgba(255,255,255,0.18)_100%)]" />
    </main>
  );
}
