import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

export default function Splash(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout((): void => {
      if (isAuthenticated()) {
        navigate('/map');
      } else {
        navigate('/login');
      }
    }, 4000);

    return (): void => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-full w-full bg-white relative overflow-hidden flex flex-col items-center justify-center">
      {/* === GRUPO SUPERIOR DIREITO === */}
      {/* Estratégia: 2 Colunas Verticais dentro de um container rotacionado */}
      <div className="absolute -top-[5%] -right-[25%] sm:-right-[10%] transform -rotate-45 flex flex-row gap-6 scale-125 opacity-100">
        {/* Coluna Esquerda (Roxo e Verde) - Mais baixa */}
        <div className="flex flex-col gap-6 justify-end mt-20">
          {/* Roxo - Médio */}
          <div
            className="w-32 h-14 bg-secondary-purple rounded-full animate-slide-in-right self-end"
            style={{ animationDelay: '0.1s' }}
          ></div>
          {/* Verde - Longo */}
          <div
            className="w-48 h-14 bg-primary-400 rounded-full animate-slide-in-right"
            style={{ animationDelay: '0.3s' }}
          ></div>
        </div>

        {/* Coluna Direita (Azul e Laranja) - Deslocada para Cima (mt-0 vs mt-20) */}
        <div className="flex flex-col gap-6 justify-start mb-20">
          {/* Azul - Curto */}
          <div
            className="w-20 h-14 bg-secondary-blue rounded-full animate-slide-in-right"
            style={{ animationDelay: '0.2s' }}
          ></div>
          {/* Laranja - Longo */}
          <div
            className="w-48 h-14 bg-secondary-orange rounded-full animate-slide-in-right"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>

      {/* === LOGO CENTRAL === */}
      <div className="z-10 text-center flex flex-col items-center animate-fade-in-up mt-8">
        <h1 className="text-7xl font-black italic tracking-tighter text-black mb-2">
          E<span className="text-black">=</span>FLOW
        </h1>
        {/* Spinner */}
        <div className="mt-8 flex gap-3">
          <div
            className="w-3 h-3 bg-secondary-blue rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="w-3 h-3 bg-secondary-purple rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-3 h-3 bg-primary-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          ></div>
          <div
            className="w-3 h-3 bg-secondary-orange rounded-full animate-bounce"
            style={{ animationDelay: '0.6s' }}
          ></div>
        </div>
      </div>

      {/* === GRUPO INFERIOR ESQUERDO === */}
      {/* Espelho do grupo superior */}
      <div className="absolute -bottom-[10%] -left-[25%] sm:-left-[10%] transform -rotate-45 flex flex-row gap-6 scale-125 opacity-100">
        {/* Coluna Esquerda (Azul e Laranja) - Mais alta */}
        <div className="flex flex-col gap-6 justify-end mb-20">
          {/* Azul - Longo */}
          <div
            className="w-48 h-14 bg-secondary-blue rounded-full animate-slide-in-left self-end"
            style={{ animationDelay: '0.1s' }}
          ></div>
          {/* Laranja - Curto */}
          <div
            className="w-20 h-14 bg-secondary-orange rounded-full animate-slide-in-left self-end"
            style={{ animationDelay: '0.3s' }}
          ></div>
        </div>

        {/* Coluna Direita (Roxo e Verde) - Mais baixa */}
        <div className="flex flex-col gap-6 justify-start mt-20">
          {/* Roxo - Médio */}
          <div
            className="w-32 h-14 bg-secondary-purple rounded-full animate-slide-in-left"
            style={{ animationDelay: '0.2s' }}
          ></div>
          {/* Verde - Médio/Longo */}
          <div
            className="w-40 h-14 bg-primary-400 rounded-full animate-slide-in-left"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
