import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPaymentById } from '../services/payment';
import { startCharging } from '../services/charging';
import { getCurrentUser } from '../services/auth';
import { storage } from '../utils/storage';
import type { Payment } from '../types';

/**
 * Payment status page component
 * Shows payment confirmation and starts charging
 */
export default function PaymentStatus() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    try {
      const paymentData = storage.getPayment<Payment>();
      if (paymentData) {
        setPayment(paymentData);
        
        // Auto-start charging after 2 seconds
        setTimeout(() => {
          handleStartCharging();
        }, 2000);
      }
    } catch (error) {
      console.error('Error loading payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCharging = async () => {
    if (!payment || !user || starting) return;

    setStarting(true);

    try {
      await startCharging(payment.stationId, user.id, payment.id);
      navigate('/charging');
    } catch (error) {
      console.error('Error starting charging:', error);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {payment?.status === 'completed' ? (
            <>
              <div className="mb-6">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pagamento Aprovado!
                </h2>
                <p className="text-[#767676] mb-4">
                  R$ {payment.amount.toFixed(2)} processado com sucesso
                </p>
              </div>

              {starting ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-[#767676]">Iniciando carregamento...</p>
                </div>
              ) : (
                <button
                  onClick={handleStartCharging}
                  className="w-full bg-primary-600 text-gray-900 font-semibold py-3 px-6 rounded-[15px] hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-all"
                >
                  Iniciar Carregamento
                </button>
              )}
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-16 h-16 text-yellow-600 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A9.001 9.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a9.003 9.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Processando Pagamento...
                </h2>
                <p className="text-[#767676]">
                  Aguarde enquanto processamos seu pagamento
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

