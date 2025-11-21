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
export default function Success(): JSX.Element {
  const navigate = useNavigate();
  const [session, setSession] = useState<ChargingSession | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

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

  const loadData = async (): Promise<void> => {
    try {
      const sessionData = await getCurrentSession();

      if (sessionData) {
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

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackToMap = (): void => {
    storage.removeSession();
    storage.removePayment();
    navigate('/map');
  };

  // Helpers de renderização
  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-[100dvh] bg-gray-100 flex justify-center items-center sm:p-4">
        <div className="w-full max-w-md bg-white h-full sm:h-[90vh] sm:max-h-[850px] sm:rounded-[2.5rem] flex flex-col items-center justify-center p-8 shadow-2xl overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sessão não encontrada</h2>
          <button
            onClick={handleBackToMap}
            className="bg-primary-400 text-black font-bold py-3 px-8 rounded-full hover:brightness-95 transition-all"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>
    );
  }

  /**
   * Calculate duration safely
   */
  const calculateDuration = (): number => {
    if (!session) return 0;

    const startTime =
      session.startTime instanceof Date ? session.startTime : parseDate(session.startTime);
    const endTime =
      session.endTime instanceof Date
        ? session.endTime
        : session.endTime
          ? parseDate(session.endTime)
          : null;

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
    // 1. Outer Wrapper (App Shell)
    <div className="h-[100dvh] bg-gray-100 flex justify-center items-center sm:p-4 overflow-hidden">
      {/* 2. Container Principal */}
      <div className="w-full max-w-md bg-white h-full sm:h-[90vh] sm:max-h-[850px] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden relative">
        {/* 3. HEADER (Transparente aqui para dar destaque ao ícone) */}
        <header className="px-6 pt-8 flex justify-center flex-shrink-0">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Resumo da Recarga
          </span>
        </header>

        {/* 4. CONTEÚDO (Scrollável) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth min-h-0 flex flex-col items-center">
          {/* Ícone de Sucesso Animado */}
          <div className="my-6 relative">
            <div className="w-24 h-24 bg-primary-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(217,248,4,0.4)] animate-bounce-slow">
              <svg
                className="w-12 h-12 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 text-center leading-tight mb-2">
            Recarga
            <br />
            Concluída!
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8 max-w-[200px]">
            Seu veículo está carregado e pronto para rodar.
          </p>

          {/* Card de Recibo (Ticket) */}
          <div className="w-full bg-gray-50 rounded-3xl p-6 border border-gray-100 relative">
            {/* Detalhe visual de "ticket" (corte circular) - Opcional, mas fica charmoso */}
            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-white rounded-full border-r border-gray-100 transform -translate-y-1/2"></div>
            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white rounded-full border-l border-gray-100 transform -translate-y-1/2"></div>

            {/* Estação */}
            {station && (
              <div className="text-center mb-6 pb-6 border-b border-dashed border-gray-300">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Estação
                </p>
                <h3 className="text-lg font-bold text-gray-900">{station.name}</h3>
                <p className="text-xs text-gray-500 mt-1 truncate">{station.address}</p>
              </div>
            )}

            {/* Grid de Detalhes */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Energia</p>
                <p className="text-xl font-black text-gray-900">
                  {session.energyDelivered.toFixed(1)}{' '}
                  <span className="text-sm font-medium text-gray-500">kWh</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Tempo</p>
                <p className="text-xl font-black text-gray-900">
                  {duration} <span className="text-sm font-medium text-gray-500">min</span>
                </p>
              </div>
            </div>

            {/* Total */}
            {payment && (
              <div className="bg-white rounded-2xl p-4 border border-gray-200 flex justify-between items-center">
                <span className="font-medium text-gray-600">Total Pago</span>
                <span className="text-2xl font-black text-gray-900">
                  R$ {payment.amount.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. FOOTER (Botão Fixo) */}
        <div className="flex-shrink-0 p-6 bg-white border-t border-gray-50 z-20">
          <button
            onClick={handleBackToMap}
            className="w-full bg-black text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Voltar ao Mapa</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
