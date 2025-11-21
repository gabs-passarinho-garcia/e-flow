/**
 * Unit tests for MapView page
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MapView from '../MapView';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ eventHandlers }: { eventHandlers?: { click?: () => void } }) => (
    <div data-testid="marker" onClick={eventHandlers?.click} />
  ),
  Polyline: () => <div data-testid="polyline" />,
}));

// Mock leaflet
vi.mock('leaflet', () => ({
  default: {
    divIcon: vi.fn(() => ({})),
  },
}));

// Mock stations service - isolated to this test file only
// Note: This mock only affects this test file, not the service tests
const mockGetAllStations = vi.fn();
vi.mock('../../services/stations', async () => {
  // Only mock what we need, keep the rest
  return {
    getAllStations: mockGetAllStations,
    getStationById: vi.fn(),
    getAvailableStations: vi.fn(),
  };
});

// Mock StationDrawer
vi.mock('../../components/StationDrawer', () => ({
  default: ({ station, onClose }: { station: unknown; onClose: () => void }) => (
    <div data-testid="station-drawer">
      <button onClick={onClose}>Close</button>
      <span>{JSON.stringify(station)}</span>
    </div>
  ),
}));

describe('MapView Page', () => {
  const mockStations = [
    {
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
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllStations.mockResolvedValue(mockStations);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render map container', () => {
    renderWithRouter(<MapView />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('should load and display stations', async () => {
    renderWithRouter(<MapView />);

    await waitFor(() => {
      expect(mockGetAllStations).toHaveBeenCalled();
    });
  });

  it('should open StationDrawer when station marker is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MapView />);

    await waitFor(() => {
      expect(screen.getByTestId('marker')).toBeInTheDocument();
    });

    const marker = screen.getAllByTestId('marker')[1]; // First marker is user location
    await user.click(marker);

    await waitFor(() => {
      expect(screen.getByTestId('station-drawer')).toBeInTheDocument();
    });
  });

  it('should close StationDrawer when close is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MapView />);

    await waitFor(() => {
      expect(screen.getByTestId('marker')).toBeInTheDocument();
    });

    const marker = screen.getAllByTestId('marker')[1];
    await user.click(marker);

    await waitFor(() => {
      expect(screen.getByTestId('station-drawer')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('station-drawer')).not.toBeInTheDocument();
    });
  });

  it('should toggle route mode', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MapView />);

    await waitFor(() => {
      const routeButton = screen.getByLabelText(/Modo Mapa|Sair do modo rota/);
      expect(routeButton).toBeInTheDocument();
    });

    const routeButton = screen.getByLabelText(/Modo Mapa|Sair do modo rota/);
    await user.click(routeButton);

    await waitFor(() => {
      expect(screen.getByTestId('polyline')).toBeInTheDocument();
    });
  });

  it('should navigate to login when profile button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<MapView />);

    await waitFor(() => {
      const profileButton = screen.getByText('Perfil');
      expect(profileButton).toBeInTheDocument();
    });

    const profileButton = screen.getByText('Perfil');
    await user.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

