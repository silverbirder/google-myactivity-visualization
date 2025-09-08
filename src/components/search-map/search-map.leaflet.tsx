"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngTuple } from "leaflet";

export default function SearchMapLeaflet({
  points,
}: {
  points: { lat: number; lng: number; name?: string; url?: string }[];
}) {
  const center: LatLngTuple =
    points[0]?.lat !== undefined && points[0]?.lng !== undefined
      ? [points[0].lat, points[0].lng]
      : [35.0, 135.0];
  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((p, i) => (
        <Marker key={i} position={[p.lat, p.lng] as LatLngTuple}>
          <Popup>
            {p.name}
            <br />
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              地図で見る
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
