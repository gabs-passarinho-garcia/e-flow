import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStationById } from '../services/stations';
import type { Station } from '../types';

/**
 * Station detail page component
 * Shows station information and allows starting charging
 */
export default function StationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStation(id);
    }
  }, [id]);

  const loadStation = async (stationId: string) => {
    try {
      const data = await getStationById(stationId);
      setStation(data);
    } catch (error) {
      console.error('Error loading station:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCharging = () => {
    if (station) {
      navigate(`/payment/${station.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Estação não encontrada</h2>
          <button
            onClick={() => navigate('/map')}
            className="btn-primary"
          >
            Voltar ao Mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <button
          onClick={() => navigate('/map')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Voltar
        </button>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Station Info Card */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{station.name}</h1>
              <p className="text-gray-600">{station.address}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              station.available
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {station.available ? 'Disponível' : 'Indisponível'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Potência</p>
              <p className="text-lg font-semibold text-gray-900">{station.power} kW</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Preço</p>
              <p className="text-lg font-semibold text-gray-900">R$ {station.pricePerKwh.toFixed(2)}/kWh</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avaliação</p>
              <p className="text-lg font-semibold text-gray-900">⭐ {station.rating}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Conectores</p>
              <p className="text-lg font-semibold text-gray-900">{station.connectorType.length}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Tipos de Conectores:</p>
            <div className="flex flex-wrap gap-2">
              {station.connectorType.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-primary-100 text-primary-800 rounded-lg text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Start Charging Button */}
        <button
          onClick={handleStartCharging}
          disabled={!station.available}
          className={`btn-primary w-full ${
            !station.available ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {station.available ? 'Iniciar Carregamento' : 'Estação Indisponível'}
        </button>
      </div>
    </div>
  );
}

