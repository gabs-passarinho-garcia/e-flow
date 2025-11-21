import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getAllStations } from '../services/stations';
import type { Station } from '../types';

// Ícone Preto (Gota Invertida)
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

// Marcador E= (Localização Atual)
const UserLocationIcon = L.divIcon({
  className: 'user-marker',
  html: `<div class="w-14 h-14 bg-primary-400 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform">
    <span class="font-black text-lg italic tracking-tighter">E=</span>
  </div>`,
  iconSize: [56, 56],
  iconAnchor: [28, 56], // Ponta no fundo do pino
});

export default function MapView() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  
  // Mock de uma rota para visualização (Roxo)
  const routeCoordinates: [number, number][] = [
    [-23.5925, -46.5333], // Início
    [-23.5900, -46.5300],
    [-23.5880, -46.5250], // Curva
    [-23.5850, -46.5250],
    [-23.5820, -46.5280], // Fim
  ];

  useEffect(() => {
    getAllStations().then(setStations);
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-100">
      
      <MapContainer
        center={[-23.5925, -46.5333]}
        zoom={14}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution=''
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Mapa estilo clean/claro
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

        <Polyline 
          positions={routeCoordinates} 
          pathOptions={{ color: '#5B4EFF', weight: 6, opacity: 0.8, lineCap: 'round' }} 
        />
      </MapContainer>

      {/* Botões Flutuantes Laterais (Direita) */}
      <div className="absolute right-5 bottom-40 flex flex-col gap-4 z-[1000]">
        <button className="w-14 h-14 bg-white rounded-full shadow-float flex items-center justify-center text-gray-700 hover:bg-gray-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>
        <button className="w-14 h-14 bg-white rounded-full shadow-float flex items-center justify-center text-gray-700 hover:bg-gray-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
        </button>
      </div>

      {/* Banner de Rota Ativa (Opcional, baseado no print da rota roxa) */}
      <div className="absolute bottom-28 left-6 right-6 z-[1000]">
        <div className="bg-secondary-purple text-white py-3 px-6 rounded-2xl shadow-lg text-center font-semibold text-sm flex items-center justify-center gap-2 animate-fade-in-up">
          Traçando rota mais eficiente
        </div>
      </div>

      {/* Barra de Navegação Inferior */}
      <div className="absolute bottom-8 left-6 right-6 h-20 bg-white rounded-[2rem] shadow-float z-[1000] flex items-center justify-between px-8">
        {/* Início */}
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 10.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8.5" /><path d="M22 12L12 2L2 12" /><path d="M12 2v10" /></svg>
          <span className="text-[10px] font-bold">Início</span>
        </button>

        {/* Estações */}
        <button className="flex flex-col items-center gap-1 text-gray-400 mr-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <span className="text-[10px] font-medium">Estações</span>
        </button>

        {/* Botão Central (Livro/Mapa) */}
        <div className="absolute left-1/2 -top-5 transform -translate-x-1/2">
          <button className="w-16 h-16 bg-primary-400 rounded-full shadow-lg border-4 border-white flex items-center justify-center transition-transform active:scale-90">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </button>
        </div>

        {/* Perfil */}
        <button className="flex flex-col items-center gap-1 text-gray-400 ml-6" onClick={() => navigate('/login')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
}