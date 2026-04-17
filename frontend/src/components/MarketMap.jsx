import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useMarketStore } from '../store/useMarketStore.js';
import { darkTileLayer, defaultMapCenter, defaultMapZoom } from '../utils/mapConfig.js';

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
    if (selectedEvent) {
      map.flyTo([selectedEvent.lat, selectedEvent.lng], Math.max(selectedEvent.zoom || 4, 4), {
        duration: 0.8
      });
      return;
    }

    map.flyTo(defaultMapCenter, defaultMapZoom, { duration: 0.8 });
  }, [map, selectedEvent]);

  return null;
}

export function MarketMap() {
  const events = useMarketStore((state) => state.events);
  const selectedEventId = useMarketStore((state) => state.selectedEventId);
  const setSelectedEvent = useMarketStore((state) => state.setSelectedEvent);
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) || events[0] || null,
    [events, selectedEventId]
  );

  return (
    <main id="global-pulse" className="absolute inset-0 z-0">
      <MapContainer
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
            pathOptions={{ color: '#47eaed', fillColor: '#47eaed', fillOpacity: 0.08, weight: 1 }}
            radius={900000}
          />
        )}
        {events.map((event, index) => (
          <Marker
            eventHandlers={{ click: () => setSelectedEvent(event.id) }}
            icon={createPulseIcon(event, selectedEventId === event.id, index)}
            key={event.id}
            position={[event.lat, event.lng]}
          >
            <Popup>
              <div className="max-w-[220px] text-surface">
                <strong>{event.title}</strong>
                <p>{event.region} · {event.category_label || event.category}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(16,20,25,0.32)_58%,#101419_100%)]" />
      <div className="pointer-events-none absolute left-4 top-32 z-[401] md:left-28">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface drop-shadow-lg md:text-5xl">
          Global Pulse
        </h1>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-secondary">
          <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />
          Live market intelligence feed
        </p>
      </div>
    </main>
  );
}
