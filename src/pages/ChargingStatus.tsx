import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSession, onChargingProgress, cancelCharging } from '../services/charging';
import type { ChargingSession } from '../types';

/**
 * Charging status page component
 * Shows real-time charging progress
 */
export default function ChargingStatus() {
  const navigate = useNavigate();
  const [session, setSession] = useState<ChargingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadSession();
    
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

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  const loadSession = async () => {
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

  const handleCancel = async () => {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Carregamento em Andamento</h1>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-8">
            {/* Battery Icon */}
            <div className="relative">
              <div className="w-48 h-32 mx-auto border-4 border-[#767676] rounded-lg relative overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary-600 transition-all duration-500"
                  style={{ height: `${session.currentBattery}%` }}
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="text-4xl font-bold text-gray-900">
                    {session.currentBattery}%
                  </span>
                </div>
              </div>
              {/* Battery terminal */}
              <div className="w-8 h-4 bg-[#767676] mx-auto -mt-1 rounded-t"></div>
            </div>

            {/* Status Info */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#767676] mb-1">Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  {session.status === 'starting' && 'Iniciando...'}
                  {session.status === 'charging' && 'Carregando...'}
                  {session.status === 'completed' && 'Concluído!'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#767676] mb-1">Energia Entregue</p>
                  <p className="text-xl font-bold text-gray-900">
                    {session.energyDelivered.toFixed(1)} kWh
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#767676] mb-1">Tempo Restante</p>
                  <p className="text-xl font-bold text-gray-900">
                    {session.estimatedTimeRemaining} min
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${session.currentBattery}%` }}
                />
              </div>
              <p className="text-sm text-[#767676]">
                {session.currentBattery}% completo
              </p>
            </div>

            {/* Cancel Button */}
            {session.status === 'charging' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full bg-red-50 text-red-600 font-semibold py-3 px-6 rounded-[15px] hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelando...' : 'Cancelar Carregamento'}
              </button>
            )}

            {session.status === 'completed' && (
              <div className="text-green-600 font-semibold">
                Carregamento concluído com sucesso!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

