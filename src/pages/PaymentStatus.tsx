import { useNavigate } from 'react-router-dom';

export default function PaymentStatus() {
  const navigate = useNavigate();

  return (
    // Outer Wrapper: Centraliza o container horizontal e verticalmente (items-center).
    <div className="min-h-screen bg-gray-100 flex justify-center items-center sm:py-8">
      
      {/* Container Mobile (Frame do Celular):
          - h-screen: Altura total no mobile.
          - sm:h-auto: No desktop, a altura se ajusta ao conteúdo (min-h-0 é implícito).
      */}
      <div className="w-full max-w-md bg-white h-screen sm:h-auto sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-y-auto">
        
        {/* Header (Fixo e Imutável) */}
        <header className="px-6 pt-8 pb-0 flex justify-start z-10 flex-shrink-0">
          <button 
            type="button" 
            aria-label="Voltar para o mapa"
            onClick={() => navigate('/map')} 
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        </header>

        {/* Conteúdo Principal (Scrollável, centraliza o bloco interno) */}
        {/* MUDANÇA: Adicionado mt-auto e mb-auto para forçar centralização vertical eficiente */}
        <div className="flex flex-col items-center text-center px-6 py-6 flex-1 mt-auto mb-auto"> 

            {/* Título */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-8 mt-4">
              Pagamento<br />Aprovado!
            </h1>
            
            {/* Ilustração SVG */}
            <div className="w-full max-w-sm mx-auto my-6" aria-hidden="true">
                <img 
                    src="/assets/svg/approved-payment-icon.svg" 
                    alt="Ilustração de Carregamento Aprovado" 
                    className="w-full h-auto"
                />
            </div>

            {/* Mensagem Card */}
            <div className="w-full border border-gray-200 rounded-3xl p-5 mb-8 bg-white shadow-sm flex-shrink-0">
              <p className="text-gray-700 font-medium text-sm leading-relaxed">
                Da próxima vez que fizer uma recarga,<br />
                <span className="font-bold text-black">lembraremos do seu carro automaticamente.</span>
              </p>
            </div>

            {/* Botão de Ação e Mensagem Inferior */}
            <div className="w-full space-y-6 mb-4 flex-shrink-0">
              <p className="text-gray-500 text-sm">
                Conte para nós sobre sua experiência<br />
                e ajude a melhorar a <span className="font-bold text-black">E-FLOW!</span>
              </p>
              
              <button
                type="button"
                onClick={() => navigate('/charging')}
                className="w-full max-w-[200px] bg-primary-400 text-black font-bold text-xl py-3 rounded-full shadow-lg hover:bg-primary-500 transition-colors mx-auto block"
              >
                Avaliar
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}