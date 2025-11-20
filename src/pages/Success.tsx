import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentSession } from '../services/charging';
import { getPaymentById } from '../services/payment';
import { getStationById } from '../services/stations';
import type { ChargingSession, Payment, Station } from '../types';
import { storage } from '../utils/storage';

/**
 * Success page component
 * Shows charging session summary
 */
export default function Success() {
  const navigate = useNavigate();
  const [session, setSession] = useState<ChargingSession | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const sessionData = await getCurrentSession();
      setSession(sessionData);

      if (sessionData) {
        const [paymentData, stationData] = await Promise.all([
          getPaymentById(sessionData.paymentId),
          getStationById(sessionData.stationId),
        ]);
        setPayment(paymentData);
        setStation(stationData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMap = () => {
    // Clear session data
    storage.removeSession();
    storage.removePayment();
    navigate('/map');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sessão não encontrada</h2>
          <button onClick={handleBackToMap} className="btn-primary">
            Voltar ao Mapa
          </button>
        </div>
      </div>
    );
  }

  const duration = session.endTime && session.startTime
    ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card text-center space-y-6">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-16 h-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Carregamento Concluído!
            </h1>
            <p className="text-gray-600">
              Seu veículo está pronto para a estrada
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-left">
            {station && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Estação</p>
                <p className="font-semibold text-gray-900">{station.name}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Energia Entregue</p>
                <p className="text-xl font-bold text-gray-900">
                  {session.energyDelivered.toFixed(1)} kWh
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Duração</p>
                <p className="text-xl font-bold text-gray-900">{duration} min</p>
              </div>
            </div>

            {payment && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Pago</span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {payment.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button onClick={handleBackToMap} className="btn-primary w-full">
            Voltar ao Mapa
          </button>
        </div>
      </div>
    </div>
  );
}

