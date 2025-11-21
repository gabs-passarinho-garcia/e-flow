/**
 * Unit tests for Success page
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Success from '../Success';
import { storage } from '../../utils/storage';
import type { ChargingSession, Payment, Station } from '../../types';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock services
const mockGetCurrentSession = vi.fn();
const mockGetPaymentById = vi.fn();
const mockGetStationById = vi.fn();

vi.mock('../../services/charging', () => ({
  getCurrentSession: mockGetCurrentSession,
  startCharging: vi.fn(),
  cancelCharging: vi.fn(),
  onChargingProgress: vi.fn(),
}));

vi.mock('../../services/payment', () => ({
  getPaymentById: mockGetPaymentById,
  processPayment: vi.fn(),
  getPaymentMethods: vi.fn(),
}));

vi.mock('../../services/stations', () => ({
  getStationById: mockGetStationById,
  getAllStations: vi.fn(),
  getAvailableStations: vi.fn(),
}));

describe('Success Page', () => {
  const mockSession: ChargingSession = {
    id: 'session-1',
    stationId: 'station-1',
    userId: 'user-1',
    paymentId: 'pay-1',
    startTime: new Date('2024-01-01T10:00:00Z'),
    endTime: new Date('2024-01-01T10:30:00Z'),
    energyDelivered: 25.5,
    currentBattery: 100,
    estimatedTimeRemaining: 0,
    status: 'completed',
  };

  const mockPayment: Payment = {
    id: 'pay-1',
    stationId: 'station-1',
    userId: 'user-1',
    amount: 50.0,
    method: { id: '1', type: 'credit', last4: '4242', brand: 'Visa' },
    status: 'completed',
    timestamp: new Date(),
  };

  const mockStation: Station = {
    id: 'station-1',
    name: 'Estação Test',
    address: 'Test Address',
    latitude: -23.5,
    longitude: -46.6,
    available: true,
    connectorType: ['Type 2 (Mennekes)'],
    power: 50,
    pricePerKwh: 0.85,
    rating: 4.5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    storage.removeSession();
    storage.removePayment();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render success message', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    mockGetPaymentById.mockResolvedValue(mockPayment);
    mockGetStationById.mockResolvedValue(mockStation);

    renderWithRouter(<Success />);

    await waitFor(() => {
      expect(screen.getByText(/Recarga/)).toBeInTheDocument();
      expect(screen.getByText(/Concluída!/)).toBeInTheDocument();
    });
  });

  it('should display session information', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    mockGetPaymentById.mockResolvedValue(mockPayment);
    mockGetStationById.mockResolvedValue(mockStation);

    renderWithRouter(<Success />);

    await waitFor(() => {
      expect(screen.getByText(/25.5/)).toBeInTheDocument();
    });
  });

  it('should display station information', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    mockGetPaymentById.mockResolvedValue(mockPayment);
    mockGetStationById.mockResolvedValue(mockStation);

    renderWithRouter(<Success />);

    await waitFor(() => {
      expect(screen.getByText('Estação Test')).toBeInTheDocument();
    });
  });

  it('should display payment information', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    mockGetPaymentById.mockResolvedValue(mockPayment);
    mockGetStationById.mockResolvedValue(mockStation);

    renderWithRouter(<Success />);

    await waitFor(() => {
      expect(screen.getByText(/R\$ 50.00/)).toBeInTheDocument();
    });
  });

  it('should navigate to /map when back button is clicked', async () => {
    const user = userEvent.setup();
    mockGetCurrentSession.mockResolvedValue(mockSession);
    mockGetPaymentById.mockResolvedValue(mockPayment);
    mockGetStationById.mockResolvedValue(mockStation);

    renderWithRouter(<Success />);

    await waitFor(() => {
      expect(screen.getByText('Voltar ao Mapa')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Voltar ao Mapa');
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/map');
    expect(storage.getSession()).toBeNull();
    expect(storage.getPayment()).toBeNull();
  });

  it('should show error message when session is not found', async () => {
    mockGetCurrentSession.mockResolvedValue(null);

    renderWithRouter(<Success />);

    await waitFor(() => {
      expect(screen.getByText('Sessão não encontrada')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    mockGetCurrentSession.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithRouter(<Success />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

