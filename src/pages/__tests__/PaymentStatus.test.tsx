/**
 * Unit tests for PaymentStatus page
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PaymentStatus from '../PaymentStatus';
import { storage } from '../../utils/storage';
import type { Payment } from '../../types';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock charging service
const mockStartCharging = vi.fn();
vi.mock('../../services/charging', () => ({
  startCharging: mockStartCharging,
  getCurrentSession: vi.fn(),
  cancelCharging: vi.fn(),
  onChargingProgress: vi.fn(),
}));

describe('PaymentStatus Page', () => {
  const mockPayment: Payment = {
    id: 'pay-1',
    stationId: 'station-1',
    userId: 'user-1',
    amount: 50.0,
    method: { id: '1', type: 'credit', last4: '4242', brand: 'Visa' },
    status: 'completed',
    timestamp: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    storage.removePayment();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render payment approved message', () => {
    storage.savePayment(mockPayment);
    renderWithRouter(<PaymentStatus />);

    expect(screen.getByText(/Pagamento/)).toBeInTheDocument();
    expect(screen.getByText(/Aprovado!/)).toBeInTheDocument();
  });

  it('should start charging session and navigate to /charging', async () => {
    const user = userEvent.setup();
    const mockSession = {
      id: 'session-1',
      stationId: 'station-1',
      userId: 'user-1',
      paymentId: 'pay-1',
      startTime: new Date(),
      energyDelivered: 0,
      currentBattery: 20,
      estimatedTimeRemaining: 45,
      status: 'starting' as const,
    };

    storage.savePayment(mockPayment);
    mockStartCharging.mockResolvedValue(mockSession);

    renderWithRouter(<PaymentStatus />);

    const startButton = screen.getByText('Acompanhar Carregamento');
    await user.click(startButton);

    await waitFor(() => {
      expect(mockStartCharging).toHaveBeenCalledWith('station-1', 'user-1', 'pay-1');
      expect(mockNavigate).toHaveBeenCalledWith('/charging');
    });
  });

  it('should show loading state during session start', async () => {
    const user = userEvent.setup();
    mockStartCharging.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    storage.savePayment(mockPayment);
    renderWithRouter(<PaymentStatus />);

    const startButton = screen.getByText('Acompanhar Carregamento');
    await user.click(startButton);

    expect(screen.getByText('Iniciando...')).toBeInTheDocument();
  });

  it('should navigate to /map if payment is not found', async () => {
    storage.removePayment();
    renderWithRouter(<PaymentStatus />);

    const startButton = screen.getByText('Acompanhar Carregamento');
    const user = userEvent.setup();
    await user.click(startButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/map');
    });
  });

  it('should navigate back to map when back button is clicked', async () => {
    const user = userEvent.setup();
    storage.savePayment(mockPayment);
    renderWithRouter(<PaymentStatus />);

    const backButton = screen.getByLabelText('Voltar para o mapa');
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/map');
  });
});

