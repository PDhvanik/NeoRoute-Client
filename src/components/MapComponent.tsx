import { toast } from '@/components/ui/use-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';

type Location = {
  name: string;
  latitude: number;
  longitude: number;
};

type PathData = {
  path: Location[];
  totalCost: number;
};

interface MapComponentProps {
  onPathFound: (pathData: PathData) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onPathFound }) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const osrmPolylinesRef = useRef<L.Polyline[]>([]); // Track OSRM polylines

  const [waypoints, setWaypoints] = useState<Location[]>([]);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Gujarat bounding box (approx):
      // Southwest: 20.1400, 68.3700
      // Northeast: 24.7000, 74.4700
      const GUJARAT_BOUNDS = L.latLngBounds(
        L.latLng(20.1400, 68.3700),
        L.latLng(24.7000, 74.4700)
      );

      const map = L.map(mapRef.current, {
        maxBounds: GUJARAT_BOUNDS,
        maxBoundsViscosity: 1.0,
      }).setView([22.2587, 71.1924], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      map.on('click', function (e) {
        if (!GUJARAT_BOUNDS.contains(e.latlng)) {
          toast({
            title: 'Out of Gujarat',
            description: 'Currently this project works only for Gujarat state.',
            variant: 'destructive',
          });
          return;
        }
        const newWaypoint: Location = {
          name: `Waypoint`,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        };

        const newMarker = L.marker(e.latlng).addTo(map);
        markersRef.current.push(newMarker);

        setWaypoints((prev) => [...prev, newWaypoint]);

        toast({
          title: `${newWaypoint.name} selected`,
          description: `Latitude: ${newWaypoint.latitude}, Longitude: ${newWaypoint.longitude}`,
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  const findPath = async () => {
    if (waypoints.length < 2) {
      toast({
        title: "Insufficient points",
        description: "Please select at least two points on the map.",
        variant: "destructive",
      });
      return;
    }

    // Clear previous OSRM polylines
    if (mapInstanceRef.current) {
      osrmPolylinesRef.current.forEach(poly => mapInstanceRef.current?.removeLayer(poly));
      osrmPolylinesRef.current = [];
    }

    let fullPath = [];
    let totalDistance = 0;

    try {
      for (let i = 0; i < waypoints.length - 1; i++) {
        const start = waypoints[i];
        const end = waypoints[i + 1];

        const startCoordinates = `${start.latitude},${start.longitude}`;
        const endCoordinates = `${end.latitude},${end.longitude}`;

        const response = await fetch(
          `${apiBase}/api/find-path?start=${startCoordinates}&end=${endCoordinates}`
        );

        if (!response.ok) {
          throw new Error(`Server Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.path || !data.path.length) {
          toast({
            title: `No path found between points ${i + 1} and ${i + 2}`,
            description: "Please try different locations.",
            variant: "destructive",
          });
          continue;
        }

        const filteredPath = data.path.filter(
          (node) => node.name !== null && node.latitude !== null && node.longitude !== null
        );

        if (!filteredPath.length) {
          toast({
            title: "Invalid path data",
            description: "The path data is invalid.",
            variant: "destructive",
          });
          return;
        }

        if (i === 0) {
          fullPath = filteredPath;
        } else {
          fullPath = [...fullPath, ...filteredPath.slice(1)];
        }

        totalDistance += data.totalCost;
      }

      await drawOSRMPath(fullPath); // Draw OSRM route(s)

      onPathFound({ path: fullPath, totalCost: totalDistance });

    } catch (error) {
      console.error("Error fetching path:", error);
      toast({
        title: "Error finding path",
        description: "Failed to retrieve path. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch and draw OSRM route for each segment
  const drawOSRMPath = async (path: Location[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous OSRM polylines
    osrmPolylinesRef.current.forEach(poly => map.removeLayer(poly));
    osrmPolylinesRef.current = [];

    if (!path || path.length < 2) return;

    const bounds = L.latLngBounds([]);

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const osrmData = await res.json();
        if (osrmData.routes && osrmData.routes.length > 0) {
          const coords = osrmData.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
          const polyline = L.polyline(coords, { color: '#1976D2', weight: 5 }).addTo(map);
          osrmPolylinesRef.current.push(polyline);
          coords.forEach(([lat, lng]: [number, number]) => bounds.extend([lat, lng]));
        }
      } catch (err) {
        toast({
          title: "OSRM Error",
          description: `Failed to fetch route for segment ${i + 1}`,
          variant: "destructive",
        });
      }
    }
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  };

  const resetMap = () => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => mapInstanceRef.current?.removeLayer(marker));
    markersRef.current = [];

    // Remove OSRM polylines
    osrmPolylinesRef.current.forEach(poly => mapInstanceRef.current?.removeLayer(poly));
    osrmPolylinesRef.current = [];

    setWaypoints([]);
    toast({ title: "Map reset", description: "Select new waypoints." });
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-900 flex flex-col gap-6 p-0 sm:p-2">
      <div
        ref={mapRef}
        className="h-[300px] sm:h-[400px] md:h-[calc(100vh-12rem)] w-full rounded-none sm:rounded-lg shadow-md z-10 border border-purple-700 bg-gray-800"
        aria-label="Map for selecting waypoints"
      />
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 px-2 sm:px-8 w-full">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <span className="text-base font-semibold text-purple-300">Waypoints:</span>
          <ul className="list-disc pl-4 max-h-32 overflow-y-auto bg-gray-800/80 rounded-md p-2 text-xs sm:text-sm shadow-sm">
            {waypoints.length === 0 ? (
              <li className="text-purple-400 italic">No waypoints selected. Click on the map to add.</li>
            ) : (
              waypoints.map((waypoint, index) => (
                <li key={index} className="truncate">
                  <span className="font-medium text-purple-200">{waypoint.name || `Point ${index + 1}`}</span>
                  <span className="ml-2 text-gray-300">Lat: {waypoint.latitude.toFixed(5)}, Long: {waypoint.longitude.toFixed(5)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex flex-row justify-center items-center gap-3 md:gap-4 w-full md:w-auto max-w-xs mx-auto md:mx-0 mt-4 md:mt-0">
          <button
            onClick={findPath}
            disabled={waypoints.length < 2}
            className="bg-purple-600 px-6 py-2 text-white rounded-md hover:bg-purple-500 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-96 text-base font-semibold shadow"
            aria-label="Find Path"
          >
            Find Path
          </button>
          <button
            onClick={resetMap}
            className="bg-purple-900 px-6 py-2 text-white rounded-md hover:bg-purple-800 focus:ring-2 focus:ring-purple-600 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full text-base font-semibold shadow"
            aria-label="Reset Map"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
