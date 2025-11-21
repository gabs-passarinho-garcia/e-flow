import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSession, onChargingProgress, cancelCharging } from '../services/charging';
import type { ChargingSession } from '../types';

/**
 * Charging status page component
 * Shows real-time charging progress
 */
export default function ChargingStatus(): JSX.Element {
  const navigate = useNavigate();
  const [session, setSession] = useState<ChargingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const loadSession = async (): Promise<void> => {
    try {
      const data = await getCurrentSession();
      setSession(data);

      if (data?.status === 'completed') {
        setTimeout(() => {
          navigate('/success');
        }, 1000);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSession();

    // Subscribe to progress updates
    const unsubscribe = onChargingProgress((updatedSession) => {
      setSession(updatedSession);

      if (updatedSession.status === 'completed') {
        setTimeout(() => {
          navigate('/success');
        }, 2000);
      }
    });

    return (): void => {
      unsubscribe();
    };
  }, [navigate]);

  const handleCancel = async (): Promise<void> => {
    if (!confirm('Tem certeza que deseja cancelar o carregamento?')) {
      return;
    }

    setCancelling(true);
    try {
      await cancelCharging();
      navigate('/map');
    } catch (error) {
      console.error('Error cancelling:', error);
    } finally {
      setCancelling(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 flex justify-center items-center sm:p-4 overflow-hidden">
      <div className="w-full max-w-md bg-white h-full sm:h-[90vh] sm:max-h-[850px] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden relative">
        {/* HEADER */}
        <header className="px-6 pt-8 pb-4 flex items-center justify-center relative bg-white z-10 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">Carregamento em Andamento</h1>
        </header>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth min-h-0 flex flex-col items-center justify-center">
          {/* CARD DE STATUS */}
          <div className="w-full bg-white rounded-3xl border border-gray-100 p-8 flex flex-col items-center shadow-sm">
            {/* === VISUALIZAÇÃO DO CARRO (SVG OTIMIZADO) === */}
            <div className="relative w-full h-48 flex items-center justify-center mb-6">
              <svg
                viewBox="0 0 300 160"
                className="w-full h-full drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Definição do Formato do Carro (Hatchback Moderno) */}
                  <path
                    id="carShape"
                    d="M25,110 C25,110 20,70 40,55 C50,48 70,35 100,30 C130,25 190,25 220,35 C240,42 260,60 270,80 C275,90 275,110 275,110 L260,110 A18,18 0 0,1 224,110 L96,110 A18,18 0 0,1 60,110 L25,110 Z"
                  />
                  {/* Máscara para cortar o líquido dentro do carro */}
                  <clipPath id="carClip">
                    <use href="#carShape" />
                  </clipPath>
                </defs>

                {/* 1. Fundo do Carro (Cinza Claro) */}
                <use href="#carShape" fill="#F3F4F6" />

                {/* 2. Líquido de Energia (Verde) - Animado */}
                <g clipPath="url(#carClip)">
                  {/* O Retângulo verde sobe conforme a bateria */}
                  <rect
                    x="0"
                    y="0" // Começa do topo
                    width="300"
                    height="160"
                    fill="#D9F804" // primary-400
                    className="transition-transform duration-1000 ease-linear"
                    // Usamos translate para empurrar o verde para baixo e revelar conforme carrega
                    // Se battery é 20%, translateY é 80%. Se 100%, translateY é 0%.
                    style={{ transform: `translateY(${100 - session.currentBattery}%)` }}
                  />

                  {/* Opcional: Efeito de brilho no topo do líquido */}
                  <rect
                    x="0"
                    y="-2"
                    width="300"
                    height="4"
                    fill="white"
                    fillOpacity="0.5"
                    className="transition-transform duration-1000 ease-linear"
                    style={{ transform: `translateY(${100 - session.currentBattery}%)` }}
                  />
                </g>

                {/* 3. Contorno do Carro (Preto) */}
                <use
                  href="#carShape"
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />

                {/* 4. Rodas */}
                <g fill="#1A1A1A">
                  <circle cx="78" cy="110" r="14" />
                  <circle cx="242" cy="110" r="14" />
                </g>
                <g fill="#555">
                  <circle cx="78" cy="110" r="6" />
                  <circle cx="242" cy="110" r="6" />
                </g>

                {/* 5. Janelas (Detalhe visual) */}
                <path
                  d="M80,55 L100,38 L160,35 L160,55 L80,55 Z M170,35 L210,40 L230,60 L230,65 L170,65 L170,35 Z"
                  fill="white"
                  stroke="#1A1A1A"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  opacity="0.6"
                />

                {/* 6. Cabo e Conector */}
                <path
                  d="M-10,90 C10,90 20,90 35,80"
                  stroke="#1A1A1A"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={session.status === 'charging' ? '10,5' : '0'}
                  className={session.status === 'charging' ? 'animate-pulse' : ''}
                />
                <circle cx="35" cy="80" r="5" fill="#1A1A1A" />

                {/* Raio de Energia (Aparece quando carregando) */}
                {session.status === 'charging' && (
                  <path
                    d="M150,50 L140,70 H155 L145,90"
                    fill="none"
                    stroke="#1A1A1A"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    className="animate-bounce"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                )}
              </svg>

              {/* Porcentagem Centralizada (Fora do SVG para melhor renderização de texto) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-gray-100 shadow-sm mt-8">
                  <span className="text-3xl font-black text-gray-900">
                    {Math.round(session.currentBattery)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-8 space-y-1">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                Status
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                {session.status === 'starting' && 'Conectando...'}
                {session.status === 'charging' && 'Carregando...'}
                {session.status === 'completed' && 'Carga Completa!'}
              </h2>
            </div>

            {/* Grid de Informações */}
            <div className="grid grid-cols-2 gap-4 w-full mb-2 px-2">
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                <span className="text-gray-400 text-[10px] font-bold uppercase mb-1">Entregue</span>
                <span className="text-lg font-black text-gray-900">
                  {session.energyDelivered.toFixed(1)}{' '}
                  <span className="text-xs font-medium text-gray-500">kWh</span>
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl">
                <span className="text-gray-400 text-[10px] font-bold uppercase mb-1">Restante</span>
                <span className="text-lg font-black text-gray-900">
                  {Math.round(session.estimatedTimeRemaining)}{' '}
                  <span className="text-xs font-medium text-gray-500">min</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 p-6 pb-10 sm:pb-6 bg-white z-20">
          <button
            onClick={handleCancel}
            disabled={cancelling || session.status === 'completed'}
            className="w-full bg-red-50 text-red-500 font-bold text-lg py-4 rounded-2xl hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelling ? 'Cancelando...' : 'Cancelar Carregamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
