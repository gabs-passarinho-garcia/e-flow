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

  /**
   * Convert string date to Date object
   */
  const parseDate = (date: Date | string | undefined): Date | null => {
    if (!date) return null;
    if (date instanceof Date) return date;
    if (typeof date === 'string') {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  const loadData = async () => {
    try {
      const sessionData = await getCurrentSession();
      
      if (sessionData) {
        // Convert date strings to Date objects
        const parsedStartTime = parseDate(sessionData.startTime);
        const parsedEndTime = sessionData.endTime ? parseDate(sessionData.endTime) : null;
        
        const processedSession: ChargingSession = {
          ...sessionData,
          startTime: parsedStartTime || new Date(),
          endTime: parsedEndTime || undefined,
        };
        
        setSession(processedSession);

        const [paymentData, stationData] = await Promise.all([
          getPaymentById(sessionData.paymentId).catch(() => null),
          getStationById(sessionData.stationId).catch(() => null),
        ]);
        setPayment(paymentData);
        setStation(stationData);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setSession(null);
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
          <button 
            onClick={handleBackToMap} 
            className="w-full bg-primary-600 text-gray-900 font-semibold py-3 px-6 rounded-[15px] hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-all"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>
    );
  }

  // Calculate duration safely
  const calculateDuration = (): number => {
    if (!session) return 0;
    
    const startTime = session.startTime instanceof Date 
      ? session.startTime 
      : parseDate(session.startTime);
    const endTime = session.endTime instanceof Date 
      ? session.endTime 
      : (session.endTime ? parseDate(session.endTime) : null);
    
    if (!startTime || !endTime) return 0;
    
    try {
      const diff = endTime.getTime() - startTime.getTime();
      return Math.max(0, Math.round(diff / 60000));
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 0;
    }
  };

  const duration = calculateDuration();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
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
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Carregamento Concluído!
            </h1>
            <p className="text-[#767676]">
              Seu veículo está pronto para a estrada
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-left">
            {station && (
              <div>
                <p className="text-sm text-[#767676] mb-1">Estação</p>
                <p className="font-semibold text-gray-900">{station.name}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#767676] mb-1">Energia Entregue</p>
                <p className="text-xl font-bold text-gray-900">
                  {session.energyDelivered.toFixed(1)} kWh
                </p>
              </div>
              <div>
                <p className="text-sm text-[#767676] mb-1">Duração</p>
                <p className="text-xl font-bold text-gray-900">{duration} min</p>
              </div>
            </div>

            {payment && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#767676]">Total Pago</span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {payment.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={handleBackToMap} 
            className="w-full bg-primary-600 text-gray-900 font-semibold py-3 px-6 rounded-[15px] hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-all"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>
    </div>
  );
}

