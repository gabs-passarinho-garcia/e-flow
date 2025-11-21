import { useNavigate } from 'react-router-dom';

export default function PaymentStatus() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-8 relative overflow-hidden">
      
      {/* Botão Voltar */}
      <div className="w-full flex justify-start mb-4 z-10">
        <button 
          type="button" 
          aria-label="Voltar para o mapa"
          onClick={() => navigate('/map')} 
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
      </div>

      <div className="flex flex-col items-center text-center z-10 mt-4">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2">
          Pagamento<br />Aprovado!
        </h1>
        
        {/* Ilustração Mockada (Carro e Fundo) */}
        <div className="relative w-full h-80 my-6 flex items-center justify-center">
          {/* Elementos de Fundo */}
          <div className="absolute w-64 h-64 bg-primary-100 rounded-full -z-10 top-0 blur-2xl opacity-70"></div>
          <div className="absolute w-48 h-48 bg-blue-100 rounded-full -z-10 bottom-0 right-10 blur-xl opacity-60"></div>
          
          {/* Imagem do Carro */}
          <img 
            src="/assets/jpg/WhatsApp Image 2025-11-20 at 10.54.50 (4).jpeg" 
            alt="Ilustração de carro carregando em um cenário verde" 
            className="object-contain h-full rounded-2xl shadow-sm" 
            style={{ clipPath: 'inset(20% 0 35% 0)' }} 
          />
        </div>

        {/* Mensagem Card */}
        <div className="w-full border border-gray-200 rounded-3xl p-5 mb-8 bg-white shadow-sm">
          <p className="text-gray-700 font-medium text-sm leading-relaxed">
            Da próxima vez que fizer uma recarga,<br />
            <span className="font-bold text-black">lembraremos do seu carro automaticamente.</span>
          </p>
        </div>

        <div className="w-full space-y-4">
          <p className="text-gray-500 text-sm">
            Conte para nós sobre sua experiência<br />
            e ajude a melhorar a <span className="font-bold text-black">E-FLOW!</span>
          </p>
          
          <button
            type="button"
            onClick={() => navigate('/charging')}
            className="w-48 bg-primary-400 text-black font-bold text-xl py-3 rounded-full shadow-lg hover:bg-primary-500 transition-colors mx-auto block"
          >
            Avaliar
          </button>
        </div>
      </div>
    </div>
  );
}