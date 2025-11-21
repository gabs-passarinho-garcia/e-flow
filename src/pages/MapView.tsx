import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getAllStations } from '../services/stations';
import type { Station } from '../types';

// Ícone Preto das Estações
const BlackPinIcon = L.divIcon({
  className: 'custom-marker',
  html: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.25));">
    <path d="M12 0C7.58 0 4 3.58 4 8C4 13.5 12 24 12 24C12 24 20 13.5 20 8C20 3.58 16.42 0 12 0ZM12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11Z" fill="black"/>
    <circle cx="12" cy="8" r="3.5" fill="white"/>
  </svg>`,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

// Marcador E= (Localização Atual - Estilo do Design)
const UserLocationIcon = L.divIcon({
  className: 'user-marker',
  html: `<div class="w-16 h-16 bg-primary-400 rounded-full border-4 border-white shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform">
    <span class="font-black text-2xl italic tracking-tighter text-black">E=</span>
  </div>`,
  iconSize: [64, 64],
  iconAnchor: [32, 32], // Centralizado
});

export default function MapView() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  // Estado para controlar se está em modo de rota ou não
  // Inicia como false para bater com o print do design (estado limpo)
  const [isRouting, setIsRouting] = useState(false); 
  
  const routeCoordinates: [number, number][] = [
    [-23.5925, -46.5333],
    [-23.5900, -46.5300],
    [-23.5880, -46.5250],
    [-23.5850, -46.5250],
    [-23.5820, -46.5280],
  ];

  useEffect(() => {
    getAllStations().then(setStations);
  }, []);

  // Função temporária para alternar o estado ao clicar no botão central
  const toggleRouteMode = () => setIsRouting(!isRouting);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-100">
      <MapContainer
        center={[-23.5925, -46.5333]}
        zoom={15} // Zoom um pouco mais próximo para bater com o design
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Usando um mapa base mais limpo/cinza para bater com o design */}
        <TileLayer
          attribution=''
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={[-23.5925, -46.5333]} icon={UserLocationIcon} />

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={BlackPinIcon}
            eventHandlers={{
              click: () => navigate(`/station/${station.id}`),
            }}
          />
        ))}

        {/* Renderização Condicional da Rota */}
        {isRouting && (
          <Polyline 
            positions={routeCoordinates} 
            pathOptions={{ color: '#5B4EFF', weight: 8, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} 
          />
        )}
      </MapContainer>

      {/* Botões Flutuantes Laterais */}
      <div className="absolute right-5 bottom-44 flex flex-col gap-4 z-[1000]">
        <button 
          type="button"
          aria-label="Filtros"
          className="w-12 h-12 bg-white rounded-2xl shadow-float flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>
        <button 
          type="button"
          aria-label="Minha Localização"
          className="w-12 h-12 bg-white rounded-2xl shadow-float flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
        </button>
      </div>

      {/* Renderização Condicional do Banner de Rota */}
      {isRouting && (
        <div className="absolute bottom-32 left-6 right-6 z-[1000]">
          <div className="bg-secondary-purple text-white py-4 px-6 rounded-3xl shadow-lg text-center font-bold text-sm flex items-center justify-center gap-3 animate-fade-in-up">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
            Traçando rota mais eficiente...
          </div>
        </div>
      )}

      {/* Barra de Navegação Inferior - CORRIGIDA */}
      <div className="absolute bottom-8 left-6 right-6 h-20 bg-white rounded-[2.5rem] shadow-float z-[1000] grid grid-cols-4 items-center px-4">
        
        {/* 1. Início */}
        <button 
          type="button"
          className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span className="text-[11px] font-bold">Início</span>
        </button>

        {/* 2. Estações */}
        <button 
          type="button"
          className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <span className="text-[11px] font-medium">Estações</span>
        </button>

        {/* 3. Botão Central (Quadrado Arredondado DENTRO da barra) */}
        <div className="flex justify-center">
          <button 
            type="button"
            aria-label="Alternar Modo de Rota"
            onClick={toggleRouteMode} // Alterna o estado ao clicar
            className="w-14 h-14 bg-primary-400 rounded-2xl shadow-sm flex items-center justify-center transition-all active:scale-95 hover:brightness-105"
          >
            {/* Ícone de Livro/Mapa do Design */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V6Z" stroke="black" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M12 21V3" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 6H22" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* 4. Perfil */}
        <button 
          type="button"
          className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-900 transition-colors" 
          onClick={() => navigate('/login')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[11px] font-medium">Perfil</span>
        </button>

      </div>
    </div>
  );
}