import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startCharging } from '../services/charging';
import { storage } from '../utils/storage';
import type { Payment } from '../types';

export default function PaymentStatus() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSession = async () => {
    setIsLoading(true);
    try {
      // Recupera o último pagamento para pegar os IDs necessários
      const lastPayment = storage.getPayment<Payment>();

      if (!lastPayment) {
        console.error("Pagamento não encontrado");
        navigate('/map'); // Fallback de segurança
        return;
      }

      // O Pulo do Gato: Inicia a sessão efetivamente antes de navegar
      await startCharging(
        lastPayment.stationId,
        lastPayment.userId,
        lastPayment.id
      );

      navigate('/charging');
    } catch (error) {
      console.error("Erro ao iniciar sessão:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer Wrapper: Ocupa 100% da altura real da janela
    <div className="h-[100dvh] bg-gray-100 flex justify-center items-center sm:p-4 overflow-hidden">
      
      {/* Container Principal (Frame) */}
      <div className="w-full max-w-md bg-white h-full sm:h-[90vh] sm:max-h-[850px] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* 1. HEADER */}
        <header className="px-6 pt-6 flex justify-start flex-shrink-0">
          <button 
            type="button" 
            aria-label="Voltar para o mapa"
            onClick={() => navigate('/map')} 
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        </header>

        {/* 2. CONTEÚDO PRINCIPAL */}
        <div className="flex-1 flex flex-col justify-evenly items-center px-6 w-full h-full pb-6"> 

            {/* Título */}
            <div className="text-center flex-shrink-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Pagamento<br />Aprovado!
                </h1>
            </div>
            
            {/* Área da Imagem */}
            <div className="flex-shrink-1 flex items-center justify-center w-full min-h-0">
                <img 
                    src="/assets/svg/approved-payment-icon.svg" 
                    alt="Ilustração de Carregamento Aprovado" 
                    className="w-auto h-auto max-h-[35vh] sm:max-h-[40vh] object-contain drop-shadow-sm"
                />
            </div>

            {/* Mensagem Card */}
            <div className="w-full border border-gray-200 rounded-3xl p-4 sm:p-5 bg-white shadow-sm flex-shrink-0">
              <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed text-center">
                Tudo pronto!<br />
                <span className="font-bold text-black">Seu carregador foi liberado.</span>
              </p>
            </div>

            {/* Footer / Botão */}
            <div className="w-full flex-shrink-0 text-center space-y-3 sm:space-y-4">
              <p className="text-gray-500 text-xs sm:text-sm">
                Conecte o cabo ao seu veículo<br />
                para iniciar a recarga na <span className="font-bold text-black">E-FLOW!</span>
              </p>
              
              <button
                type="button"
                onClick={handleStartSession}
                disabled={isLoading}
                // REMOVIDO: a classe 'block' que conflitava com 'flex'
                className="w-full max-w-[280px] bg-primary-400 text-black font-bold text-lg sm:text-xl py-3 sm:py-4 rounded-full shadow-lg hover:brightness-95 transition-all mx-auto active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando...
                  </>
                ) : (
                  'Acompanhar Carregamento'
                )}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}