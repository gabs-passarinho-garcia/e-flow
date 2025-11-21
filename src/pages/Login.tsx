import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/map');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container principal: Garante que a página toda possa rolar.
    <div className="min-h-screen flex flex-col items-center bg-white w-full overflow-y-auto px-4 sm:px-8">
      {/* Dots de Progresso Decorativos */}
      <div className="flex justify-center gap-3 pt-8 mb-12 w-full max-w-sm" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-primary-400"></div>
        <div className="w-3 h-3 rounded-full bg-secondary-purple"></div>
        <div className="w-3 h-3 rounded-full bg-secondary-orange"></div>
        <div className="w-3 h-3 rounded-full bg-secondary-blue opacity-50"></div>
      </div>

      {/* Container do Formulário */}
      <div className="w-full max-w-sm flex flex-col flex-1 mx-auto pb-8">
        <div className="text-center mb-10 w-full">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Crie uma conta
          </h1>
          <p className="text-gray-500 font-medium">
            Isso leva menos de um minuto.
            <br />
            Entre com seu e-mail e senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* Inputs */}
          <input type="text" placeholder="Nome" aria-label="Nome" className="input-field" />

          <input
            type="email"
            placeholder="E-mail"
            aria-label="Endereço de E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Senha"
            aria-label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          {/* Botão de Registro */}
          <button type="submit" disabled={loading} className="btn-primary mt-6">
            {loading ? 'Entrando...' : 'Registre-se'}
          </button>

          {/* Divisor 'Ou' */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          {/* Botões Sociais */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt=""
                aria-hidden="true"
              />
              <span className="text-gray-600 font-medium text-sm">
                Continue com sua conta Google
              </span>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              {/* Ícone da Microsoft - AGORA É SVG INLINE */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
              </svg>
              <span className="text-gray-600 font-medium text-sm">
                Continue com sua conta Microsoft
              </span>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors"
            >
              {/* Ícone Apple */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78 1.18-.19 2.31-.89 3.51-.84 1.54.06 2.74.62 3.48 1.56-3.17 1.63-2.66 5.76.36 7.1-.71 1.73-1.69 3.41-2.43 4.37zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span className="text-white font-medium text-sm">Continue com sua conta Apple</span>
            </button>
          </div>
        </form>

        <p className="text-center mt-8 mb-4 text-gray-500 text-sm">
          Já possui uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-secondary-purple font-bold underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
