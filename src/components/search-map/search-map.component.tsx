"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngTuple } from "leaflet";
import { Box, NativeSelect } from "@chakra-ui/react";
import { useEffect, useMemo, type ChangeEvent } from "react";

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
  }[];
  productOptions: string[];
  product: string;
  setProduct: (product: string) => void;
}) => {
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
      })),
    [points],
  );

  return (
    <Box>
      <Box mb={2}>
        <NativeSelect.Root
          disabled={productOptions.length === 0}
          size="sm"
          width="fit-content"
        >
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

      <Box h="400px" w="100%">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkersBoundsUpdater markers={markers} />
          <MapCenterUpdater position={center} />
          {points.map((p, i) => (
            <Marker key={i} position={[p.lat, p.lng] as LatLngTuple}>
              <Popup>
                {p.name} {p.product && <>（{p.product}）</>}
                <br />
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  地図で見る
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default SearchMapComponent;
