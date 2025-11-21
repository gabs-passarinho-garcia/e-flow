import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simula um carregamento inicial mais longo (5 segundos)
    // Isso permite apreciar a animação de entrada e dá peso ao app
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        navigate('/map');
      } else {
        navigate('/login');
      }
    }, 5000); // 5000ms = 5 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* === GRUPO SUPERIOR DIREITO === */}
      <div className="absolute -top-10 -right-24 transform -rotate-45 opacity-90 flex flex-col gap-4 scale-125">
        {/* Linha 1: Roxo e Azul Claro */}
        <div className="flex gap-4 justify-end">
           <div className="w-32 h-10 bg-secondary-purple rounded-full shadow-sm animate-slide-in-right" style={{ animationDelay: '0.1s' }}></div>
           <div className="w-16 h-10 bg-secondary-blue rounded-full shadow-sm animate-slide-in-right" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Linha 2: Verde Neon (Primary) */}
        <div className="flex justify-end mr-8">
          <div className="w-40 h-10 bg-primary-400 rounded-full shadow-sm animate-slide-in-right" style={{ animationDelay: '0.3s' }}></div>
        </div>

        {/* Linha 3: Laranja */}
        <div className="flex justify-end mr-4">
          <div className="w-32 h-10 bg-secondary-orange rounded-full shadow-sm animate-slide-in-right" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* === LOGO CENTRAL === */}
      <div className="z-10 text-center flex flex-col items-center animate-fade-in-up">
        <h1 className="text-6xl font-black italic tracking-tighter text-black mb-2">
          E<span className="text-black">=</span>FLOW
        </h1>
        {/* Spinner Sutil */}
        <div className="mt-8 flex gap-2">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-secondary-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-secondary-orange rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* === GRUPO INFERIOR ESQUERDO === */}
      <div className="absolute -bottom-10 -left-24 transform -rotate-45 opacity-90 flex flex-col gap-4 scale-125">
        {/* Linha 1: Azul Claro */}
        <div className="flex justify-start ml-4">
          <div className="w-32 h-10 bg-secondary-blue rounded-full shadow-sm animate-slide-in-left" style={{ animationDelay: '0.1s' }}></div>
        </div>

        {/* Linha 2: Roxo */}
        <div className="flex justify-start ml-8">
          <div className="w-40 h-10 bg-secondary-purple rounded-full shadow-sm animate-slide-in-left" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Linha 3: Verde e Laranja */}
        <div className="flex gap-4 justify-start">
          <div className="w-16 h-10 bg-secondary-orange rounded-full shadow-sm animate-slide-in-left" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-32 h-10 bg-primary-400 rounded-full shadow-sm animate-slide-in-left" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

    </div>
  );
}