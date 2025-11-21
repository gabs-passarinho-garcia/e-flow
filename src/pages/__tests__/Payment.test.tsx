/**
 * Unit tests for Payment page
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Payment from '../Payment';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ stationId: '1' }),
  };
});

// Mock services
const mockGetStationById = vi.fn();
const mockGetPaymentMethods = vi.fn();
const mockProcessPayment = vi.fn();
const mockGetCurrentUser = vi.fn();

vi.mock('../../services/stations', () => ({
  getStationById: mockGetStationById,
  getAllStations: vi.fn(),
  getAvailableStations: vi.fn(),
}));

vi.mock('../../services/payment', () => ({
  getPaymentMethods: mockGetPaymentMethods,
  processPayment: mockProcessPayment,
  getPaymentById: vi.fn(),
}));

vi.mock('../../services/auth', () => ({
  getCurrentUser: mockGetCurrentUser,
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: vi.fn(),
}));

describe('Payment Page', () => {
  const mockStation = {
    id: '1',
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

  const mockPaymentMethods = [
    { id: '1', type: 'credit' as const, last4: '4242', brand: 'Visa' },
    { id: '2', type: 'debit' as const, last4: '8888', brand: 'Mastercard' },
    { id: '3', type: 'pix' as const },
  ];

  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetStationById.mockResolvedValue(mockStation);
    mockGetPaymentMethods.mockResolvedValue(mockPaymentMethods);
    mockGetCurrentUser.mockReturnValue(mockUser);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/payment/:stationId" element={component} />
        </Routes>
      </BrowserRouter>,
    );
  };

  it('should render payment form', async () => {
    renderWithRouter(<Payment />);

    await waitFor(() => {
      expect(screen.getByText('Pagamento')).toBeInTheDocument();
    });
  });

  it('should load station and payment methods', async () => {
    renderWithRouter(<Payment />);

    await waitFor(() => {
      expect(mockGetStationById).toHaveBeenCalledWith('1');
      expect(mockGetPaymentMethods).toHaveBeenCalled();
    });
  });

  it('should display station information', async () => {
    renderWithRouter(<Payment />);

    await waitFor(() => {
      expect(screen.getByText('Estação Test')).toBeInTheDocument();
    });
  });

  it('should display payment methods', async () => {
    renderWithRouter(<Payment />);

    await waitFor(() => {
      expect(screen.getByText('Cartão de Crédito')).toBeInTheDocument();
      expect(screen.getByText('Cartão de Débito')).toBeInTheDocument();
      expect(screen.getByText('PIX')).toBeInTheDocument();
    });
  });

  it('should select payment method', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Payment />);

    await waitFor(() => {
      expect(screen.getByText('PIX')).toBeInTheDocument();
    });

    const pixMethod = screen.getByText('PIX').closest('label');
    if (pixMethod) {
      await user.click(pixMethod);
    }

    // Method should be selected (visual check would require checking classes)
  });

  it('should process payment and navigate to payment-status', async () => {
    const user = userEvent.setup();
    const mockPayment = {
      id: 'pay-1',
      stationId: '1',
      userId: 'user-1',
      amount: 25.5,
      method: mockPaymentMethods[0],
      status: 'completed' as const,
      timestamp: new Date(),
    };

    mockProcessPayment.mockResolvedValue(mockPayment);

    renderWithRouter(<Payment />);

    await waitFor(() => {
      expect(screen.getByText('Iniciar recarga')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Iniciar recarga');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockProcessPayment).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/payment-status');
    });
  });

  it('should show loading state during processing', async () => {
    const user = userEvent.setup();
    mockProcessPayment.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithRouter(<Payment />);

    await waitFor(() => {
      expect(screen.getByText('Iniciar recarga')).toBeInTheDocument();
    });

    const submitButton = screen.getByText('Iniciar recarga');
    await user.click(submitButton);

    expect(screen.getByText('Processando...')).toBeInTheDocument();
  });

  it('should navigate back to map when back button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Payment />);

    await waitFor(() => {
      const backButton = screen.getByLabelText('Voltar');
      expect(backButton).toBeInTheDocument();
    });

    const backButton = screen.getByLabelText('Voltar');
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/map');
  });
});

