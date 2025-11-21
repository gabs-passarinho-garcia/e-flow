/**
 * Unit tests for Splash page
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Splash from '../Splash';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock auth service - isolated to this test file only
const mockIsAuthenticated = vi.fn();
vi.mock('../../services/auth', () => ({
  isAuthenticated: mockIsAuthenticated,
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe('Splash Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render splash screen with logo', () => {
    mockIsAuthenticated.mockReturnValue(false);
    renderWithRouter(<Splash />);

    expect(screen.getByText(/E=FLOW/)).toBeInTheDocument();
  });

  it('should navigate to /login when not authenticated after timeout', async () => {
    mockIsAuthenticated.mockReturnValue(false);
    renderWithRouter(<Splash />);

    // Wait for the timeout (4000ms)
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      },
      { timeout: 5000 },
    );
  });

  it('should navigate to /map when authenticated after timeout', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    renderWithRouter(<Splash />);

    // Wait for the timeout (4000ms)
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/map');
      },
      { timeout: 5000 },
    );
  });

  it('should cleanup timer on unmount', async () => {
    mockIsAuthenticated.mockReturnValue(false);
    const { unmount } = renderWithRouter(<Splash />);

    unmount();

    // Wait a bit to ensure timer doesn't fire
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Wait longer than the timeout to ensure it didn't fire
    await new Promise((resolve) => setTimeout(resolve, 5000));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

