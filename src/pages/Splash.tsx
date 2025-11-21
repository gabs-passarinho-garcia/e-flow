import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        navigate('/map');
      } else {
        navigate('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center">
      {/* Formas Geométricas Superiores */}
      <div className="absolute -top-10 -right-10 flex flex-col gap-4 rotate-45 opacity-90 pointer-events-none">
        <div className="flex gap-4">
          <div className="w-24 h-8 bg-secondary-purple rounded-full"></div>
          <div className="w-12 h-8 bg-secondary-blue rounded-full"></div>
        </div>
        <div className="flex gap-4 ml-8">
          <div className="w-32 h-8 bg-primary-400 rounded-full"></div>
        </div>
        <div className="flex gap-4 ml-4">
          <div className="w-24 h-8 bg-secondary-orange rounded-full"></div>
        </div>
      </div>

      {/* Logo */}
      <div className="z-10 text-center animate-pulse">
        <h1 className="text-5xl font-black italic tracking-tighter text-gray-900">
          E<span className="text-primary-400">=</span>FLOW
        </h1>
      </div>

      {/* Formas Geométricas Inferiores */}
      <div className="absolute -bottom-10 -left-10 flex flex-col gap-4 rotate-45 opacity-90 pointer-events-none">
        <div className="flex gap-4 mr-8">
          <div className="w-16 h-8 bg-secondary-blue rounded-full"></div>
          <div className="w-24 h-8 bg-secondary-purple rounded-full"></div>
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-8 bg-secondary-orange rounded-full"></div>
          <div className="w-32 h-8 bg-primary-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}