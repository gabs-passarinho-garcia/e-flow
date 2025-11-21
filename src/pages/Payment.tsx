import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStationById } from '../services/stations';
import { getPaymentMethods, processPayment } from '../services/payment';
import { getCurrentUser } from '../services/auth';
import type { Station, PaymentMethod } from '../types';

/**
 * Payment page component
 * Handles payment processing
 */
export default function Payment() {
  const { stationId } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    if (stationId) {
      loadData();
    }
  }, [stationId]);

  const loadData = async () => {
    try {
      const [stationData, methods] = await Promise.all([
        getStationById(stationId!),
        getPaymentMethods(),
      ]);
      setStation(stationData);
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedMethod(methods[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!station || !selectedMethod || !user) return;

    setProcessing(true);

    try {
      const method = paymentMethods.find((m) => m.id === selectedMethod);
      if (!method) return;

      // Calculate estimated cost (mock: assume 30 kWh)
      const estimatedKwh = 30;
      const amount = station.pricePerKwh * estimatedKwh;

      await processPayment(station.id, user.id, amount, method);
      navigate('/payment-status');
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Estação não encontrada</h2>
          <button
            onClick={() => navigate('/map')}
            className="btn-primary"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>
    );
  }

  const estimatedKwh = 30;
  const amount = station.pricePerKwh * estimatedKwh;
  const selectedMethodData = paymentMethods.find((m) => m.id === selectedMethod);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white px-4 py-4">
        <button
          onClick={() => navigate(`/station/${station.id}`)}
          className="text-[#767676] hover:text-gray-900 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Station Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Carregamento</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#767676]">Estação:</span>
              <span className="font-semibold text-gray-900">{station.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#767676]">Energia Estimada:</span>
              <span className="font-semibold text-gray-900">{estimatedKwh} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#767676]">Preço por kWh:</span>
              <span className="font-semibold text-gray-900">R$ {station.pricePerKwh.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-primary-600">R$ {amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Método de Pagamento</h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {method.type === 'credit' && '💳 Cartão de Crédito'}
                    {method.type === 'debit' && '💳 Cartão de Débito'}
                    {method.type === 'pix' && '⚡ PIX'}
                  </div>
                  {method.last4 && (
                    <div className="text-sm text-[#767676]">
                      {method.brand} •••• {method.last4}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={!selectedMethod || processing}
            className="w-full bg-primary-600 text-gray-900 font-semibold py-3 px-6 rounded-[15px] hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

