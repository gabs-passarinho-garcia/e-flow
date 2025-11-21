/**
 * Unit tests for Login page
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock auth service - only for this test file
const mockLogin = vi.fn();
vi.mock('../../services/auth', () => {
  // Use dynamic import to avoid circular dependencies
  return {
    login: mockLogin,
    getCurrentUser: vi.fn(() => null),
    isAuthenticated: vi.fn(() => false),
    logout: vi.fn(),
  };
});

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render login form', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText('Crie uma conta')).toBeInTheDocument();
    expect(screen.getByLabelText('Endereço de E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Registre-se')).toBeInTheDocument();
  });

  it('should update email input value', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Endereço de E-mail');
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should update password input value', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const passwordInput = screen.getByLabelText('Senha');
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should call login and navigate to /map on form submit', async () => {
    const user = userEvent.setup();
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    mockLogin.mockResolvedValue(mockUser);

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Endereço de E-mail');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Registre-se');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/map');
    });
  });

  it('should show loading state during submit', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Endereço de E-mail');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Registre-se');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(screen.getByText('Entrando...')).toBeInTheDocument();
  });

  it('should handle login errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLogin.mockRejectedValue(new Error('Login failed'));

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText('Endereço de E-mail');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByText('Registre-se');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should render social login buttons', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('should navigate to /login when "Já possui conta" is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const loginLink = screen.getByText('Entrar');
    await user.click(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

