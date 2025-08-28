"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FlyToLocation = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15);
  }, [position, map]);
  return null;
};

const LocationMap = () => {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);

  const handleGetMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Таны хөтөч байршил дэмжихгүй байна.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentPos([lat, lng]);
        setMarkerPos([lat, lng]); // дуртай үед дарахад тэмдэглэнэ
      },
      (err) => {
        alert("Байршил авахад алдаа гарлаа: " + err.message);
      }
    );
  };

  return (
    <div>
      <button
        onClick={handleGetMyLocation}
        style={{ marginBottom: "10px" }}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        📍 Миний байршлыг авах
      </button>

      <MapContainer
        center={[47.918873, 106.917517]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentPos && <FlyToLocation position={currentPos} />}
        {markerPos && <Marker position={markerPos} />}
      </MapContainer>

      {markerPos && (
        <p style={{ marginTop: "10px" }} className="text-sm text-gray-500">
          Сонгосон байршил: {markerPos[0]}, {markerPos[1]}
        </p>
      )}
    </div>
  );
};

export default LocationMap;
