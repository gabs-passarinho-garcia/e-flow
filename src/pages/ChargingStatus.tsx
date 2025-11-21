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

      // Navigate to success when complete
      if (updatedSession.status === 'completed') {
        setTimeout(() => {
          navigate('/success');
        }, 2000);
      }
    });

    return (): void => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // CORREÇÃO: h-full para se ajustar ao container pai
    <div className="h-full bg-gray-100 flex justify-center items-center sm:p-4 overflow-hidden">
      {/* Container Principal */}
      <div className="w-full max-w-md bg-white h-full sm:h-[90vh] sm:max-h-[850px] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden relative">
        {/* HEADER (Fixo) */}
        <header className="px-6 pt-8 pb-4 flex items-center justify-center relative bg-white z-10 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">Carregamento em Andamento</h1>
        </header>

        {/* CONTEÚDO (Scrollável) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth min-h-0 flex flex-col items-center justify-center">
          {/* Card Principal */}
          <div className="w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 flex flex-col items-center">
            {/* Bateria / Monitor Visual */}
            <div className="mb-8 relative">
              <div className="w-48 h-32 border-[6px] border-gray-500 rounded-xl relative overflow-hidden bg-white flex items-center justify-center z-10">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary-400 transition-all duration-1000 ease-in-out opacity-90"
                  style={{ height: `${session.currentBattery}%` }}
                />
                <span className="text-4xl font-black text-gray-900 z-20 relative mix-blend-multiply">
                  {Math.round(session.currentBattery)}%
                </span>
              </div>
              <div className="w-12 h-4 bg-gray-400 mx-auto rounded-b-lg -mt-1 opacity-80"></div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-8 space-y-1">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                Status
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                {session.status === 'starting' && 'Iniciando...'}
                {session.status === 'charging' && 'Carregando...'}
                {session.status === 'completed' && 'Finalizando...'}
              </h2>
            </div>

            {/* Grid de Informações */}
            <div className="grid grid-cols-2 gap-8 w-full mb-8 px-2">
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs font-medium mb-1">Energia Entregue</span>
                <span className="text-xl font-black text-gray-900">
                  {session.energyDelivered.toFixed(1)} kWh
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-gray-100">
                <span className="text-gray-400 text-xs font-medium mb-1">Tempo Restante</span>
                <span className="text-xl font-black text-gray-900">
                  {Math.round(session.estimatedTimeRemaining)} min
                </span>
              </div>
            </div>

            {/* Barra de Progresso Linear */}
            <div className="w-full space-y-2">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${session.currentBattery}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-400 font-medium">
                {Math.round(session.currentBattery)}% completo
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER: Adicionado pb-10 para evitar corte no mobile */}
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
