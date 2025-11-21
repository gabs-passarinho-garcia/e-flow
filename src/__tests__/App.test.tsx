/**
 * Unit tests for App component
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock virtual:pwa-register
vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn(() => vi.fn()),
}));

// Mock auth service - isolated to this test file only
const mockIsAuthenticated = vi.fn();
vi.mock('../services/auth', () => ({
  isAuthenticated: mockIsAuthenticated,
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}));

// Mock pages to simplify testing
vi.mock('../pages/Splash', () => ({
  default: () => <div data-testid="splash">Splash</div>,
}));

vi.mock('../pages/Login', () => ({
  default: () => <div data-testid="login">Login</div>,
}));

vi.mock('../pages/MapView', () => ({
  default: () => <div data-testid="map-view">MapView</div>,
}));

vi.mock('../pages/Payment', () => ({
  default: () => <div data-testid="payment">Payment</div>,
}));

vi.mock('../pages/PaymentStatus', () => ({
  default: () => <div data-testid="payment-status">PaymentStatus</div>,
}));

vi.mock('../pages/ChargingStatus', () => ({
  default: () => <div data-testid="charging-status">ChargingStatus</div>,
}));

vi.mock('../pages/Success', () => ({
  default: () => <div data-testid="success">Success</div>,
}));

// Mock InstallModal
vi.mock('../components/InstallModal', () => ({
  default: () => <div data-testid="install-modal">InstallModal</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock return values
    mockIsAuthenticated.mockReturnValue(false);
  });

  const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
    return render(<MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>);
  };

  it('should render InstallModal globally', () => {
    renderWithRouter(<App />);
    expect(screen.getByTestId('install-modal')).toBeInTheDocument();
  });

  it('should render Splash page at root route', () => {
    renderWithRouter(<App />, ['/']);
    expect(screen.getByTestId('splash')).toBeInTheDocument();
  });

  it('should render Login page at /login route', () => {
    renderWithRouter(<App />, ['/login']);
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('should redirect to /login when not authenticated and accessing protected route', () => {
    mockIsAuthenticated.mockReturnValue(false);
    renderWithRouter(<App />, ['/map']);

    // Should redirect to login
    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('map-view')).not.toBeInTheDocument();
  });

  it('should allow access to protected route when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true);
    renderWithRouter(<App />, ['/map']);

    expect(screen.getByTestId('map-view')).toBeInTheDocument();
  });

  it('should protect /payment/:stationId route', () => {
    mockIsAuthenticated.mockReturnValue(false);
    renderWithRouter(<App />, ['/payment/1']);

    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('payment')).not.toBeInTheDocument();
  });

  it('should allow access to /payment/:stationId when authenticated', () => {
    mockIsAuthenticated.mockReturnValue(true);
    renderWithRouter(<App />, ['/payment/1']);

    expect(screen.getByTestId('payment')).toBeInTheDocument();
  });

  it('should protect /payment-status route', () => {
    mockIsAuthenticated.mockReturnValue(false);
    renderWithRouter(<App />, ['/payment-status']);

    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('payment-status')).not.toBeInTheDocument();
  });

  it('should protect /charging route', () => {
    mockIsAuthenticated.mockReturnValue(false);
    renderWithRouter(<App />, ['/charging']);

    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('charging-status')).not.toBeInTheDocument();
  });

  it('should protect /success route', () => {
    mockIsAuthenticated.mockReturnValue(false);
    renderWithRouter(<App />, ['/success']);

    expect(screen.getByTestId('login')).toBeInTheDocument();
    expect(screen.queryByTestId('success')).not.toBeInTheDocument();
  });

  it('should redirect unknown routes to root', () => {
    renderWithRouter(<App />, ['/unknown-route']);

    // Should redirect to splash (root)
    expect(screen.getByTestId('splash')).toBeInTheDocument();
  });

  it('should register service worker on mount', async () => {
    const { registerSW } = await import('virtual:pwa-register');
    renderWithRouter(<App />);

    expect(registerSW).toHaveBeenCalled();
  });
});

