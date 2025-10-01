"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngTuple } from "leaflet";
import { Box, NativeSelect } from "@chakra-ui/react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { NotFoundEmptyState } from "../not-found-empty-state";

L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type Position = LatLngTuple;
type MarkerData = {
  position: LatLngTuple;
  name?: string;
  url?: string;
  product?: string;
  title?: string;
};

type ClusterData = {
  position: LatLngTuple;
  markers: MarkerData[];
  count: number;
};

const calculateDistance = (pos1: LatLngTuple, pos2: LatLngTuple): number => {
  const latlng1 = L.latLng(pos1[0], pos1[1]);
  const latlng2 = L.latLng(pos2[0], pos2[1]);
  return latlng1.distanceTo(latlng2);
};

const clusterMarkers = (
  markers: MarkerData[],
  maxDistance = 100,
): ClusterData[] => {
  const clusters: ClusterData[] = [];
  const usedMarkers = new Set<number>();

  markers.forEach((marker, index) => {
    if (usedMarkers.has(index)) return;

    const clusterMarkers = [marker];
    usedMarkers.add(index);

    markers.forEach((otherMarker, otherIndex) => {
      if (usedMarkers.has(otherIndex)) return;

      const distance = calculateDistance(marker.position, otherMarker.position);
      if (distance <= maxDistance) {
        clusterMarkers.push(otherMarker);
        usedMarkers.add(otherIndex);
      }
    });

    const centerLat =
      clusterMarkers.reduce((sum, m) => sum + m.position[0], 0) /
      clusterMarkers.length;
    const centerLng =
      clusterMarkers.reduce((sum, m) => sum + m.position[1], 0) /
      clusterMarkers.length;

    clusters.push({
      position: [centerLat, centerLng],
      markers: clusterMarkers,
      count: clusterMarkers.length,
    });
  });

  return clusters;
};

const createClusterIcon = (count: number): L.DivIcon => {
  const size = count === 1 ? 25 : Math.min(40 + Math.log(count) * 5, 60);
  const className =
    count === 1
      ? "single-marker"
      : `cluster-marker cluster-${count < 10 ? "small" : count < 100 ? "medium" : "large"}`;

  return L.divIcon({
    html: `<div style="
      background-color: ${count === 1 ? "transparent" : count < 10 ? "#3388ff" : count < 100 ? "#ff8833" : "#ff3333"};
      color: white;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: ${count < 10 ? "12px" : "14px"};
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${count === 1 ? "" : count}</div>`,
    className,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const MapCenterUpdater = ({ position }: { position?: Position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
};

const ZoomHandler = ({ onZoomEnd }: { onZoomEnd: (zoom: number) => void }) => {
  useMapEvents({
    zoomend: (e) => {
      const map = e.target as L.Map;
      onZoomEnd(map.getZoom());
    },
  });
  return null;
};

const MarkersBoundsUpdater = ({ markers }: { markers?: MarkerData[] }) => {
  const map = useMap();

  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((marker) => marker.position));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [markers, map]);

  return null;
};

const SearchMapComponent = ({
  points,
  productOptions,
  product,
  setProduct,
}: {
  points: {
    lat: number;
    lng: number;
    name?: string;
    url?: string;
    product?: string;
    title?: string;
  }[];
  productOptions: string[];
  product: string;
  setProduct: (product: string) => void;
}) => {
  const [zoom, setZoom] = useState(14);

  const center: LatLngTuple =
    points[0]?.lat !== undefined && points[0]?.lng !== undefined
      ? [points[0].lat, points[0].lng]
      : [35.0, 135.0];

  const markers: MarkerData[] = useMemo(
    () =>
      points.map((p) => ({
        position: [p.lat, p.lng] as LatLngTuple,
        name: p.name,
        url: p.url,
        product: p.product,
        title: p.title,
      })),
    [points],
  );

  const clusterDistance = useMemo(() => {
    if (zoom >= 16) return 50;
    if (zoom >= 14) return 100;
    if (zoom >= 12) return 200;
    return 500;
  }, [zoom]);

  const clusters = useMemo(() => {
    return clusterMarkers(markers, clusterDistance);
  }, [markers, clusterDistance]);

  return (
    <Box>
      {productOptions.length > 0 && (
        <Box mb={2}>
          <NativeSelect.Root size="sm" width="fit-content">
            <NativeSelect.Field
              value={product}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setProduct(e.target.value)
              }
            >
              {productOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>
      )}

      <Box h="400px" w="100%">
        {points.length === 0 ? (
          <NotFoundEmptyState style={{ height: "100%", width: "100%" }} />
        ) : (
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomHandler onZoomEnd={setZoom} />
            <MarkersBoundsUpdater markers={markers} />
            <MapCenterUpdater position={center} />
            {clusters.map((cluster, i) => {
              const firstMarker = cluster.markers[0];
              const markerIcon =
                cluster.count === 1
                  ? undefined
                  : createClusterIcon(cluster.count);
              return (
                <Marker
                  key={i}
                  position={cluster.position}
                  {...(markerIcon ? { icon: markerIcon } : {})}
                >
                  <Popup maxWidth={300}>
                    {cluster.count === 1 && firstMarker ? (
                      <div>
                        {firstMarker.title && (
                          <>
                            <strong>{firstMarker.title}</strong>
                            <br />
                          </>
                        )}
                        {firstMarker.name}
                        <br />
                        {firstMarker.url && (
                          <a
                            href={firstMarker.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            地図で見る
                          </a>
                        )}
                      </div>
                    ) : (
                      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        <strong>{cluster.count}個の地点</strong>
                        <br />
                        <br />
                        {cluster.markers.map((marker, idx) => (
                          <div
                            key={idx}
                            style={{
                              marginBottom: "8px",
                              paddingBottom: "8px",
                              borderBottom:
                                idx < cluster.markers.length - 1
                                  ? "1px solid #eee"
                                  : "none",
                            }}
                          >
                            {marker.title && (
                              <>
                                <strong>{marker.title}</strong>
                                <br />
                              </>
                            )}
                            {marker.name}
                            <br />
                            {marker.url && (
                              <a
                                href={marker.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                地図で見る
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </Box>
    </Box>
  );
};

export default SearchMapComponent;
