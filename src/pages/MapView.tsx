import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getAllStations } from '../services/stations';
import type { Station } from '../types';
import { getCurrentUser } from '../services/auth';
import { logout } from '../services/auth';

// Fix for default marker icon in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Map view component
 * Displays charging stations on a map
 */
export default function MapView() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available'>('all');
  const user = getCurrentUser();

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const data = await getAllStations();
      setStations(data);
    } catch (error) {
      console.error('Error loading stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredStations = selectedFilter === 'available'
    ? stations.filter(s => s.available)
    : stations;

  // Default center: São Paulo
  const center: [number, number] = [-23.5505, -46.6333];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">E-Flow</h1>
            <p className="text-sm text-gray-600">Olá, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setSelectedFilter('available')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedFilter === 'available'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Disponíveis
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900 mb-1">{station.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{station.address}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      station.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {station.available ? 'Disponível' : 'Indisponível'}
                    </span>
                    <span className="text-xs text-gray-600">
                      ⭐ {station.rating}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/station/${station.id}`)}
                    className="btn-primary text-sm w-full mt-2"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

