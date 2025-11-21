import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStationById } from '../services/stations';
import { getPaymentMethods, processPayment } from '../services/payment';
import { getCurrentUser } from '../services/auth';
import type { Station, PaymentMethod } from '../types';

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

  const handleSubmit = async () => {
    if (!station || !selectedMethod || !user) return;

    setProcessing(true);

    try {
      const method = paymentMethods.find((m) => m.id === selectedMethod);
      // Se não achar nos métodos padrão, pode ser uma carteira digital (mock)
      const finalMethod = method || { id: selectedMethod, type: 'digital_wallet' } as any;

      const amount = station.pricePerKwh * 30;

      await processPayment(station.id, user.id, amount, finalMethod);
      navigate('/payment-status');
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !station) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const costPerKwh = station.pricePerKwh;
  const idleFee = 1.80;

  return (
    // 1. Outer Wrapper
    <div className="h-[100dvh] bg-gray-100 flex justify-center items-center sm:p-4 overflow-hidden">
      
      {/* 2. Container Principal */}
      <div className="w-full max-w-md bg-white h-full sm:h-[90vh] sm:max-h-[850px] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* 3. HEADER */}
        <header className="px-6 pt-6 pb-4 flex items-center relative bg-white z-10 flex-shrink-0 border-b border-transparent">
          <button
            onClick={() => navigate('/map')}
            aria-label="Voltar"
            className="absolute left-6 p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-center w-full text-gray-900">Pagamento</h1>
        </header>

        {/* 4. CONTEÚDO */}
        <div className="flex-1 overflow-y-auto px-6 py-2 scroll-smooth min-h-0">
          
          <div className="flex flex-col gap-6 pb-6">
            {/* Cards de Informação */}
            <div className="space-y-3">
                <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm bg-gray-50/50">
                <div className="flex items-center gap-3 text-gray-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <span className="font-medium text-sm">Custo</span>
                </div>
                <span className="font-bold text-gray-900">R${costPerKwh.toFixed(2)} / kWv</span>
                </div>

                <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm bg-gray-50/50">
                <div className="flex items-center gap-3 text-gray-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <div className="flex flex-col leading-none">
                        <span className="font-medium mb-1 text-sm">Tempo de ociosidade</span>
                        <span className="text-[10px] text-gray-400">Tolerância: 2 min</span>
                    </div>
                </div>
                <span className="font-bold text-gray-900">R${idleFee.toFixed(2)} / min</span>
                </div>
            </div>

            {/* Estação */}
            <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{station.name}</h2>
                        <p className="text-gray-500 text-xs truncate max-w-[200px] mt-0.5">{station.address}</p>
                    </div>
                </div>
            </div>

            {/* Cupom */}
            <div className="flex gap-3">
                <div className="flex-1 border border-gray-300 rounded-xl px-4 py-3.5 flex items-center gap-2 bg-white focus-within:border-primary-400 transition-colors">
                    <svg className="text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    <input 
                        type="text" 
                        placeholder="Adicione cupom de desconto" 
                        className="w-full outline-none text-sm bg-transparent placeholder-gray-400 text-gray-900"
                    />
                </div>
                <button className="bg-primary-400 text-black font-bold px-6 rounded-xl text-sm shadow-sm hover:brightness-95 transition-all active:scale-95">
                    Aplicar
                </button>
            </div>

            {/* Métodos de Pagamento */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider">Método de pagamento</h3>
                    <button className="text-[#5B4EFF] text-xs font-bold hover:underline">Alterar</button>
                </div>

                <div className="space-y-3">
                    {/* Métodos Salvos */}
                    {paymentMethods.map((method) => (
                    <label
                        key={method.id}
                        className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all active:scale-[0.99] ${
                        selectedMethod === method.id
                            ? 'border-black bg-gray-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex-1 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMethod === method.id ? 'bg-white border border-gray-100' : 'bg-gray-100'}`}>
                                {method.type === 'credit' && <span className="text-xs font-bold">💳</span>}
                                {method.type === 'pix' && <span className="text-xs font-bold">💠</span>}
                                {method.type === 'debit' && <span className="text-xs font-bold">🏧</span>}
                            </div>
                            
                            <div className="flex flex-col">
                                <span className={`font-semibold text-sm ${selectedMethod === method.id ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {method.type === 'credit' && 'Cartão de Crédito'}
                                    {method.type === 'debit' && 'Cartão de Débito'}
                                    {method.type === 'pix' && 'PIX'}
                                </span>
                                {method.last4 && (
                                    <span className="text-xs text-gray-400">**** {method.last4} • {method.brand}</span>
                                )}
                            </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedMethod === method.id ? 'border-black' : 'border-gray-300'
                        }`}>
                            {selectedMethod === method.id && (
                                <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                            )}
                        </div>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedMethod === method.id}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            className="hidden"
                        />
                    </label>
                    ))}

                    {/* Carteiras Digitais (Apple/Google) */}
                    {/* Apple Pay */}
                    <label
                        className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all active:scale-[0.99] ${
                        selectedMethod === 'apple_pay'
                            ? 'border-black bg-gray-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex-1 flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center">
                                {/* Apple Logo SVG */}
                                <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current text-black">
                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
                                </svg>
                            </div>
                            <span className={`font-semibold text-sm ${selectedMethod === 'apple_pay' ? 'text-gray-900' : 'text-gray-700'}`}>Apple Pay</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedMethod === 'apple_pay' ? 'border-black' : 'border-gray-300'
                        }`}>
                            {selectedMethod === 'apple_pay' && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                        </div>
                        <input type="radio" name="paymentMethod" value="apple_pay" checked={selectedMethod === 'apple_pay'} onChange={(e) => setSelectedMethod(e.target.value)} className="hidden" />
                    </label>

                    {/* Google Pay */}
                    <label
                        className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all active:scale-[0.99] ${
                        selectedMethod === 'google_pay'
                            ? 'border-black bg-gray-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex-1 flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center">
                                {/* Google 'G' Logo SVG */}
                                <svg viewBox="0 0 24 24" className="w-5 h-5">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                            </div>
                            <span className={`font-semibold text-sm ${selectedMethod === 'google_pay' ? 'text-gray-900' : 'text-gray-700'}`}>Google Pay</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            selectedMethod === 'google_pay' ? 'border-black' : 'border-gray-300'
                        }`}>
                            {selectedMethod === 'google_pay' && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                        </div>
                        <input type="radio" name="paymentMethod" value="google_pay" checked={selectedMethod === 'google_pay'} onChange={(e) => setSelectedMethod(e.target.value)} className="hidden" />
                    </label>

                </div>
            </div>
          </div>
        </div>

        {/* 5. FOOTER */}
        <div className="flex-shrink-0 p-6 bg-white border-t border-gray-50 z-20">
            <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-gray-500 text-sm">Total estimado</span>
                <span className="text-2xl font-black text-gray-900">R$ 35,40</span>
            </div>
            <button
                onClick={handleSubmit}
                disabled={!selectedMethod || processing}
                className="w-full bg-secondary-blue text-black font-bold text-xl py-4 rounded-2xl shadow-lg hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
                {processing ? 'Processando...' : 'Iniciar recarga'}
            </button>
        </div>

      </div>
    </div>
  );
}