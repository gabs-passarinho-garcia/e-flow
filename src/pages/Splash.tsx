import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

/**
 * Splash screen component
 * Shows logo and transitions to login or map
 */
export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        navigate('/map');
      } else {
        navigate('/login');
      }
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-600">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">E-Flow</h1>
          <p className="text-xl text-gray-800">Carregamento de Carros Elétricos</p>
        </div>
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

