import { useNavigate } from 'react-router-dom';

export default function PaymentStatus() {
  const navigate = useNavigate();

  return (
    // Outer Wrapper: Ocupa 100% da altura real da janela (dvh evita bugs no mobile)
    <div className="h-[100dvh] bg-gray-100 flex justify-center items-center sm:p-4 overflow-hidden">
      
      {/* Container Principal (Frame) */}
      <div className="w-full max-w-md bg-white h-full sm:h-[90vh] sm:max-h-[850px] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* 1. HEADER (Compacto e Fixo) */}
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

        {/* 2. CONTEÚDO PRINCIPAL 
            - justify-evenly: O segredo! Distribui o espaço em branco IGUALMENTE entre os elementos.
            - h-full: Obriga o flex a usar toda a altura disponível.
        */}
        <div className="flex-1 flex flex-col justify-evenly items-center px-6 w-full h-full pb-6"> 

            {/* Título (Escalável com clamp ou breakpoints) */}
            <div className="text-center flex-shrink-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Pagamento<br />Aprovado!
                </h1>
            </div>
            
            {/* Área da Imagem (Controle Total) 
                - max-h-[40vh]: A imagem nunca vai ocupar mais de 40% da altura da tela.
                - w-auto: Mantém a proporção.
            */}
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
                Da próxima vez que fizer uma recarga,<br />
                <span className="font-bold text-black">lembraremos do seu carro automaticamente.</span>
              </p>
            </div>

            {/* Footer / Botão */}
            <div className="w-full flex-shrink-0 text-center space-y-3 sm:space-y-4">
              <p className="text-gray-500 text-xs sm:text-sm">
                Conte para nós sobre sua experiência<br />
                e ajude a melhorar a <span className="font-bold text-black">E-FLOW!</span>
              </p>
              
              <button
                type="button"
                onClick={() => navigate('/charging')}
                className="w-full max-w-[200px] bg-primary-400 text-black font-bold text-lg sm:text-xl py-3 sm:py-4 rounded-full shadow-lg hover:brightness-95 transition-all mx-auto block active:scale-95"
              >
                Avaliar
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}