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
      if (!method) return;

      const amount = station.pricePerKwh * 30;

      await processPayment(station.id, user.id, amount, method);
      navigate('/payment-status');
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !station) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const costPerKwh = station.pricePerKwh;
  const idleFee = 1.80;

  return (
    // Wrapper Desktop: Centraliza e dá um padding seguro
    <div className="min-h-screen bg-gray-100 flex justify-center items-center sm:py-4">
      
      {/* Container Mobile (Frame do Celular)
          - h-[100dvh]: Altura total dinâmica no mobile (ignora barra de navegação)
          - sm:h-[90vh]: No desktop, usa 90% da altura da tela (evita cortes em telas pequenas)
          - sm:max-h-[850px]: Trava a altura máxima em monitores grandes
      */}
      <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] h-[100dvh] sm:h-[90vh] sm:max-h-[850px] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* 1. HEADER (Fixo e imutável) */}
        <header className="px-6 pt-6 pb-4 flex items-center relative bg-white z-10 flex-shrink-0">
          <button
            onClick={() => navigate('/map')}
            aria-label="Voltar"
            className="absolute left-6 p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h1 className="text-2xl font-bold text-center w-full">Pagamento</h1>
        </header>

        {/* 2. CONTEÚDO (Scrollável) */}
        <div className="flex-1 overflow-y-auto px-6 py-2 scroll-smooth">
          
          {/* Cards de Informação */}
          <div className="space-y-3 mb-8">
            <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span className="font-medium">Custo</span>
              </div>
              <span className="font-bold text-gray-900">R${costPerKwh.toFixed(2)} / kWv</span>
            </div>

            <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div className="flex flex-col leading-none">
                    <span className="font-medium mb-1">Tempo de ociosidade</span>
                    <span className="text-[10px] text-gray-400">Tempo de tolerância: 2 min <span className="underline">Saiba Mais</span></span>
                </div>
              </div>
              <span className="font-bold text-gray-900">R${idleFee.toFixed(2)} / 1 min</span>
            </div>
          </div>

          {/* Estação */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{station.name}</h2>
                    <p className="text-gray-500 text-xs truncate max-w-[200px]">{station.address}</p>
                </div>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>

          {/* Cupom */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 border border-gray-300 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg className="text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <input 
                    type="text" 
                    placeholder="Adicione cupom de desconto" 
                    className="w-full outline-none text-sm bg-transparent placeholder-gray-400 text-gray-900"
                />
            </div>
            <button className="bg-primary-400 text-black font-bold px-6 rounded-xl text-sm shadow-sm hover:brightness-95 transition-all">
                Aplicar
            </button>
          </div>

          {/* Métodos de Pagamento */}
          {/* Adicionado padding bottom generoso para garantir que o último item saia debaixo do botão fixo */}
          <div className="pb-32"> 
            <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 font-medium">Metodo de pagamento</h3>
                <button className="text-[#5B4EFF] text-sm font-bold underline">Alterar/adicionar</button>
            </div>

            <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-gray-800 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex-1 flex items-center gap-3">
                        {method.type === 'credit' && (
                            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                        )}
                        {method.type === 'pix' && (
                            <div className="w-6 h-6 flex items-center justify-center">⚡</div>
                        )}
                        
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-700 text-sm">
                                {method.type === 'credit' && 'Cartão de Crédito/Débito'}
                                {method.type === 'debit' && 'Cartão de Débito'}
                                {method.type === 'pix' && 'PIX'}
                            </span>
                            {method.last4 && (
                                <span className="text-xs text-gray-400">**** {method.last4}</span>
                            )}
                        </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedMethod === method.id ? 'border-gray-900' : 'border-gray-300'
                    }`}>
                        {selectedMethod === method.id && (
                            <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
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
                
                <div className="flex items-center p-4 border border-gray-300 rounded-2xl opacity-50 cursor-not-allowed">
                    <span className="font-medium text-gray-700 text-sm ml-9">Apple Pay</span>
                </div>
                <div className="flex items-center p-4 border border-gray-300 rounded-2xl opacity-50 cursor-not-allowed">
                    <span className="font-medium text-gray-700 text-sm ml-9">Google Pay</span>
                </div>
            </div>
          </div>

        </div>

        {/* 3. FOOTER (Botão Fixo) 
            - flex-shrink-0: Garante que o botão nunca seja "espremido" ou cortado
            - z-20: Fica acima do scroll
        */}
        <div className="flex-shrink-0 p-6 bg-white border-t border-gray-100 z-20">
            <button
                onClick={handleSubmit}
                disabled={!selectedMethod || processing}
                className="w-full bg-secondary-blue text-black font-bold text-xl py-4 rounded-2xl shadow-lg hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing ? 'Processando...' : 'Iniciar recarga'}
            </button>
        </div>

      </div>
    </div>
  );
}