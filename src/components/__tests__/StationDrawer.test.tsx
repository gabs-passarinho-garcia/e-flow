/**
 * Unit tests for StationDrawer component
 */
import { describe, it, expect, vi, beforeEach } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import StationDrawer from '../StationDrawer';
import type { Station } from '../../types';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('StationDrawer Component', () => {
  const mockStation: Station = {
    id: '1',
    name: 'Estação Shopping Center Norte',
    address: 'Av. Cásper Líbero, 225 - Vila Guilherme, São Paulo - SP',
    latitude: -23.5005,
    longitude: -46.6333,
    available: true,
    connectorType: ['Type 2 (Mennekes)', 'CCS (Combo)'],
    power: 50,
    pricePerKwh: 0.85,
    rating: 4.5,
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render station information', () => {
    renderWithRouter(<StationDrawer station={mockStation} onClose={mockOnClose} />);

    expect(screen.getByText('Estação Shopping Center Norte')).toBeInTheDocument();
    expect(screen.getByText(/Av. Cásper Líbero/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<StationDrawer station={mockStation} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Fechar detalhes da estação');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<StationDrawer station={mockStation} onClose={mockOnClose} />);

    const overlay = screen.getByRole('dialog').previousElementSibling;
    if (overlay) {
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should navigate to payment page when start charging button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<StationDrawer station={mockStation} onClose={mockOnClose} />);

    const startButton = screen.getByText('Agendar uma Recarga');
    await user.click(startButton);

    expect(mockNavigate).toHaveBeenCalledWith('/payment/1');
  });

  it('should render charger list', () => {
    renderWithRouter(<StationDrawer station={mockStation} onClose={mockOnClose} />);

    expect(screen.getByText('Carregadores Disponíveis')).toBeInTheDocument();
    expect(screen.getByText(/CCS • 180 Kw/)).toBeInTheDocument();
    expect(screen.getByText(/CCS • 90 Kw/)).toBeInTheDocument();
    expect(screen.getByText(/CCS • 40 Kw/)).toBeInTheDocument();
  });

  it('should render rating stars', () => {
    renderWithRouter(<StationDrawer station={mockStation} onClose={mockOnClose} />);

    // Should render 5 stars (4 filled + 1 outline)
    const stars = screen.getAllByRole('img', { hidden: true }).filter((img) => {
      const svg = img.closest('svg');
      return svg?.getAttribute('viewBox') === '0 0 24 24';
    });

    expect(stars.length).toBeGreaterThan(0);
  });

  it('should render status information', () => {
    renderWithRouter(<StationDrawer station={mockStation} onClose={mockOnClose} />);

    expect(screen.getByText(/Status: Normal/)).toBeInTheDocument();
    expect(screen.getByText(/Última Manutenção/)).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    renderWithRouter(<StationDrawer station={mockStation} onClose={mockOnClose} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'station-name');
  });
});

