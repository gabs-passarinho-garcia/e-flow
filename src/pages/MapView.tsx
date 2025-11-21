import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getAllStations } from '../services/stations';
import type { Station } from '../types';
// Importar o novo Drawer
import StationDrawer from '../components/StationDrawer';

// Ícone Preto das Estações (Ajustado para ser mais nítido)
const BlackPinIcon = L.divIcon({
  className: 'custom-marker',
  html: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.3));">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C7.58172 0 4 3.58172 4 8C4 13.5 12 24 12 24C12 24 20 13.5 20 8C20 3.58172 16.4183 0 12 0ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" fill="#1A1A1A"/>
    <circle cx="12" cy="8" r="3" fill="white"/>
  </svg>`,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

// Marcador E= (Localização Atual - Estilo "Pulse")
const UserLocationIcon = L.divIcon({
  className: 'user-marker',
  html: `<div class="relative w-16 h-16 flex items-center justify-center">
    <div class="absolute w-full h-full bg-primary-400/30 rounded-full animate-ping"></div>
    <div class="relative w-14 h-14 bg-primary-400 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center transform transition-transform hover:scale-105">
        <span class="font-black text-xl italic tracking-tighter text-black">E=</span>
    </div>
  </div>`,
  iconSize: [64, 64],
  iconAnchor: [32, 32],
});

export default function MapView(): JSX.Element {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [isRouting, setIsRouting] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Coordenadas para simular a rota roxa
  const routeCoordinates: [number, number][] = [
    [-23.5925, -46.5333], // Ponto A
    [-23.59, -46.53],
    [-23.588, -46.525],
    [-23.585, -46.525],
    [-23.582, -46.528], // Ponto B
  ];

  useEffect(() => {
    void getAllStations().then(setStations);
  }, []);

  const toggleRouteMode = (): void => setIsRouting(!isRouting);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-100">
      <MapContainer
        center={[-23.5925, -46.5333]}
        zoom={15}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <Marker position={[-23.5925, -46.5333]} icon={UserLocationIcon} />

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={BlackPinIcon}
            eventHandlers={{
              click: () => setSelectedStation(station),
            }}
          />
        ))}

        {isRouting && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: '#5B4EFF',
              weight: 6,
              opacity: 1,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '1, 10',
              dashOffset: '10',
            }}
          />
        )}
      </MapContainer>

      {/* Drawer de Detalhes */}
      {selectedStation && (
        <StationDrawer station={selectedStation} onClose={() => setSelectedStation(null)} />
      )}

      {/* === UI FLUTUANTE SOBRE O MAPA === */}

      {/* 1. Botões Laterais (Direita) */}
      <div className="absolute right-5 bottom-48 flex flex-col gap-3 z-[900]">
        <button
          type="button"
          aria-label="Configurações do mapa"
          className="w-12 h-12 bg-white rounded-full shadow-float flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-90 transition-all"
        >
          {/* Ícone de Ajustes/Filtro */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
        </button>
        <button
          type="button"
          aria-label="Minha localização"
          className="w-12 h-12 bg-white rounded-full shadow-float flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-90 transition-all"
        >
          {/* Ícone de Mira GPS */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </button>
      </div>

      {/* 2. Chips de Filtro (Acima da Barra Inferior) - NOVO! */}
      <div className="absolute bottom-32 left-0 right-0 z-[900] flex gap-3 overflow-x-auto px-6 pb-2 no-scrollbar snap-x">
        {/* Chip Ativo (Borda Azul) */}
        <button className="snap-start flex-shrink-0 bg-white border-2 border-[#2E9AFF] text-[#2E9AFF] font-bold px-5 py-2.5 rounded-full shadow-sm text-sm whitespace-nowrap active:scale-95 transition-transform">
          Traçar rota
        </button>

        {/* Chips Normais */}
        <button className="snap-start flex-shrink-0 bg-white text-gray-600 font-medium px-5 py-2.5 rounded-full shadow-sm text-sm whitespace-nowrap active:scale-95 transition-transform border border-transparent hover:border-gray-200">
          Planejar Viagem
        </button>

        <button className="snap-start flex-shrink-0 bg-white text-gray-600 font-medium px-5 py-2.5 rounded-full shadow-sm text-sm whitespace-nowrap active:scale-95 transition-transform border border-transparent hover:border-gray-200">
          Carregadores
        </button>
      </div>

      {/* 3. Barra de Navegação Inferior (Ícones Ajustados) */}
      <div className="absolute bottom-8 left-6 right-6 h-20 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[1000] grid grid-cols-4 items-center px-2">
        {/* Início - Ícone de Carro */}
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 transition-colors h-full w-full"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
          <span className="text-[10px] font-bold">Início</span>
        </button>

        {/* Estações - Ícone de Plug */}
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 transition-colors h-full w-full"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span className="text-[10px] font-bold">Estações</span>
        </button>

        {/* Botão Central (Mapa) - Destaque Amarelo */}
        <div className="relative -top-1">
          <button
            type="button"
            aria-label={isRouting ? 'Sair do modo rota' : 'Modo Mapa'}
            onClick={toggleRouteMode}
            className="w-16 h-16 bg-primary-400 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-90 border-4 border-gray-100"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
          </button>
        </div>

        {/* Perfil - Ícone de Usuário */}
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 transition-colors h-full w-full"
          onClick={() => navigate('/login')}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </div>
    </div>
  );
}
