import type { Station } from '../types';

/**
 * Mock stations service
 * Provides mock data for charging stations
 */

const CONNECTOR_TYPE_2 = 'Type 2 (Mennekes)';
const CONNECTOR_CCS = 'CCS (Combo)';
const CONNECTOR_CHADEMO = 'CHAdeMO';

const MOCK_STATIONS: Station[] = [
  {
    id: '1',
    name: 'Estação Shopping Center Norte',
    address: 'Av. Cásper Líbero, 225 - Vila Guilherme, São Paulo - SP',
    latitude: -23.5005,
    longitude: -46.6333,
    available: true,
    connectorType: [CONNECTOR_TYPE_2, CONNECTOR_CCS],
    power: 50,
    pricePerKwh: 0.85,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Estação Parque Ibirapuera',
    address: 'Av. Pedro Álvares Cabral - Vila Mariana, São Paulo - SP',
    latitude: -23.5874,
    longitude: -46.6576,
    available: true,
    connectorType: [CONNECTOR_TYPE_2, CONNECTOR_CHADEMO],
    power: 22,
    pricePerKwh: 0.75,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Estação Avenida Paulista',
    address: 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP',
    latitude: -23.5614,
    longitude: -46.6565,
    available: false,
    connectorType: [CONNECTOR_CCS, CONNECTOR_TYPE_2],
    power: 150,
    pricePerKwh: 1.2,
    rating: 4.2,
  },
  {
    id: '4',
    name: 'Estação Shopping Morumbi',
    address: 'Av. Roque Petroni Jr., 1089 - Vila Gertrudes, São Paulo - SP',
    latitude: -23.6214,
    longitude: -46.6995,
    available: true,
    connectorType: [CONNECTOR_TYPE_2, CONNECTOR_CCS, CONNECTOR_CHADEMO],
    power: 50,
    pricePerKwh: 0.9,
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Estação Aeroporto de Congonhas',
    address: 'Av. Washington Luís, s/n - Vila Congonhas, São Paulo - SP',
    latitude: -23.6267,
    longitude: -46.6564,
    available: true,
    connectorType: [CONNECTOR_TYPE_2, CONNECTOR_CCS],
    power: 22,
    pricePerKwh: 1.0,
    rating: 4.3,
  },
  {
    id: '6',
    name: 'Estação Parque Villa-Lobos',
    address: 'Av. Prof. Fonseca Rodrigues, 2001 - Alto de Pinheiros, São Paulo - SP',
    latitude: -23.5456,
    longitude: -46.7289,
    available: true,
    connectorType: [CONNECTOR_TYPE_2],
    power: 22,
    pricePerKwh: 0.7,
    rating: 4.7,
  },
  // NOVAS ESTAÇÕES ABC PAULISTA
  {
    id: '7',
    name: 'Estação Shopping Grand Plaza',
    address: 'Av. Industrial, 600 - Jardim, Santo André - SP',
    latitude: -23.6599, // Perto de Santo André (sua cidade! 😉)
    longitude: -46.5367,
    available: true,
    connectorType: [CONNECTOR_TYPE_2, CONNECTOR_CCS],
    power: 75,
    pricePerKwh: 0.95,
    rating: 4.4,
  },
  {
    id: '8',
    name: 'Estação Shopping Metrópole',
    address: 'Pça. Samuel Sabatini, 200 - Centro, São Bernardo do Campo - SP',
    latitude: -23.6896, // Perto de São Bernardo (sua cidade natal!)
    longitude: -46.567,
    available: false, // Deixando indisponível pra testar o filtro
    connectorType: [CONNECTOR_CCS, CONNECTOR_CHADEMO],
    power: 100,
    pricePerKwh: 1.1,
    rating: 4.9,
  },
  {
    id: '9',
    name: 'Estação Park Shopping São Caetano',
    address: 'Estrada das Lágrimas, 855 - São José, São Caetano do Sul - SP',
    latitude: -23.63,
    longitude: -46.551,
    available: true,
    connectorType: [CONNECTOR_TYPE_2],
    power: 22,
    pricePerKwh: 0.8,
    rating: 4.1,
  },
];

/**
 * Get all stations
 */
export const getAllStations = async (): Promise<Station[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...MOCK_STATIONS];
};

/**
 * Get station by ID
 */
export const getStationById = async (id: string): Promise<Station | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_STATIONS.find((station) => station.id === id) || null;
};

/**
 * Get available stations
 */
export const getAvailableStations = async (): Promise<Station[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_STATIONS.filter((station) => station.available);
};
