/**
 * Unit tests for ChargingStatus page
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ChargingStatus from '../ChargingStatus';
import { storage } from '../../utils/storage';
import type { ChargingSession } from '../../types';

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
const mockUnsubscribe = vi.fn();
const mockGetCurrentSession = vi.fn();
const mockOnChargingProgress = vi.fn(() => mockUnsubscribe);
const mockCancelCharging = vi.fn();
vi.mock('../../services/charging', () => ({
  getCurrentSession: mockGetCurrentSession,
  onChargingProgress: mockOnChargingProgress,
  cancelCharging: mockCancelCharging,
  startCharging: vi.fn(),
}));

// Mock window.confirm
const mockConfirm = vi.fn();

describe('ChargingStatus Page', () => {
  const mockSession: ChargingSession = {
    id: 'session-1',
    stationId: 'station-1',
    userId: 'user-1',
    paymentId: 'pay-1',
    startTime: new Date(),
    energyDelivered: 10.5,
    currentBattery: 50,
    estimatedTimeRemaining: 30,
    status: 'charging',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    storage.removeSession();
    window.confirm = mockConfirm;
    mockConfirm.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render charging status', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    renderWithRouter(<ChargingStatus />);

    await waitFor(() => {
      expect(screen.getByText('Carregamento em Andamento')).toBeInTheDocument();
    });
  });

  it('should display battery percentage', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    renderWithRouter(<ChargingStatus />);

    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  it('should display energy delivered and time remaining', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    renderWithRouter(<ChargingStatus />);

    await waitFor(() => {
      expect(screen.getByText(/10.5/)).toBeInTheDocument();
      expect(screen.getByText(/30/)).toBeInTheDocument();
    });
  });

  it('should subscribe to progress updates', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    renderWithRouter(<ChargingStatus />);

    await waitFor(() => {
      expect(mockOnChargingProgress).toHaveBeenCalled();
    });
  });

  it('should navigate to /success when charging is completed', async () => {
    const completedSession: ChargingSession = {
      ...mockSession,
      status: 'completed',
      endTime: new Date(),
      currentBattery: 100,
    };

    mockGetCurrentSession.mockResolvedValue(completedSession);
    renderWithRouter(<ChargingStatus />);

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/success');
      },
      { timeout: 2000 },
    );
  });

  it('should cancel charging when cancel button is clicked', async () => {
    const user = userEvent.setup();
    mockGetCurrentSession.mockResolvedValue(mockSession);
    mockCancelCharging.mockResolvedValue(undefined);

    renderWithRouter(<ChargingStatus />);

    await waitFor(() => {
      expect(screen.getByText('Cancelar Carregamento')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancelar Carregamento');
    await user.click(cancelButton);

    await waitFor(() => {
      expect(mockCancelCharging).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/map');
    });
  });

  it('should not cancel if user does not confirm', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);
    mockGetCurrentSession.mockResolvedValue(mockSession);

    renderWithRouter(<ChargingStatus />);

    await waitFor(() => {
      expect(screen.getByText('Cancelar Carregamento')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancelar Carregamento');
    await user.click(cancelButton);

    expect(mockCancelCharging).not.toHaveBeenCalled();
  });

  it('should show loading state initially', () => {
    mockGetCurrentSession.mockResolvedValue(null);
    renderWithRouter(<ChargingStatus />);

    // Loading spinner should be visible
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should unsubscribe from progress updates on unmount', async () => {
    mockGetCurrentSession.mockResolvedValue(mockSession);
    const { unmount } = renderWithRouter(<ChargingStatus />);

    await waitFor(() => {
      expect(mockOnChargingProgress).toHaveBeenCalled();
    });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});

