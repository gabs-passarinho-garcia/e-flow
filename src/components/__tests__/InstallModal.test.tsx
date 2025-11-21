/**
 * Unit tests for InstallModal component
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstallModal from '../InstallModal';
import * as usePWAInstallHook from '../../hooks/usePWAInstall';

// Mock the usePWAInstall hook
vi.mock('../../hooks/usePWAInstall', () => ({
  usePWAInstall: vi.fn(),
}));

describe('InstallModal Component', () => {
  const mockInstallApp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    // Reset navigator.userAgent
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0',
      configurable: true,
    });
  });

  it('should not render when showInstallPrompt is false', () => {
    (usePWAInstallHook.usePWAInstall as ReturnType<typeof vi.fn>).mockReturnValue({
      showInstallPrompt: false,
      installApp: mockInstallApp,
      canInstall: false,
    });

    const { container } = render(<InstallModal />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when showInstallPrompt is true', () => {
    (usePWAInstallHook.usePWAInstall as ReturnType<typeof vi.fn>).mockReturnValue({
      showInstallPrompt: true,
      installApp: mockInstallApp,
      canInstall: true,
    });

    render(<InstallModal />);
    expect(screen.getByText('Instale o E-Flow')).toBeInTheDocument();
  });

  it('should detect iOS correctly', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    (usePWAInstallHook.usePWAInstall as ReturnType<typeof vi.fn>).mockReturnValue({
      showInstallPrompt: false,
      installApp: mockInstallApp,
      canInstall: false,
    });

    render(<InstallModal />);

    await waitFor(() => {
      expect(screen.getByText(/Toque no botão/)).toBeInTheDocument();
    });
  });

  it('should show iOS instructions when iOS is detected', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
      configurable: true,
    });

    (usePWAInstallHook.usePWAInstall as ReturnType<typeof vi.fn>).mockReturnValue({
      showInstallPrompt: false,
      installApp: mockInstallApp,
      canInstall: false,
    });

    render(<InstallModal />);

    await waitFor(() => {
      const compartilharElements = screen.getAllByText(/Compartilhar/);
      expect(compartilharElements.length).toBeGreaterThan(0);
      expect(screen.getByText(/Adicionar à Tela de Início/)).toBeInTheDocument();
    });
  });

  it('should show Android button when not iOS', () => {
    (usePWAInstallHook.usePWAInstall as ReturnType<typeof vi.fn>).mockReturnValue({
      showInstallPrompt: true,
      installApp: mockInstallApp,
      canInstall: true,
    });

    render(<InstallModal />);
    expect(screen.getByText('Instalar Agora')).toBeInTheDocument();
  });

  it('should call installApp and close modal when install button is clicked', async () => {
    const user = userEvent.setup();
    (usePWAInstallHook.usePWAInstall as ReturnType<typeof vi.fn>).mockReturnValue({
      showInstallPrompt: true,
      installApp: mockInstallApp,
      canInstall: true,
    });

    render(<InstallModal />);
    const installButton = screen.getByText('Instalar Agora');

    await user.click(installButton);

    expect(mockInstallApp).toHaveBeenCalled();
  });

  it('should dismiss modal and save to sessionStorage when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    (usePWAInstallHook.usePWAInstall as ReturnType<typeof vi.fn>).mockReturnValue({
      showInstallPrompt: true,
      installApp: mockInstallApp,
      canInstall: true,
    });

    const { container } = render(<InstallModal />);
    const dismissButton = screen.getByText('Agora não, usar no navegador');

    await user.click(dismissButton);

    expect(sessionStorage.getItem('pwa_install_refused')).toBe('true');
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('should respect pwa_install_refused in sessionStorage for iOS', () => {
    sessionStorage.setItem('pwa_install_refused', 'true');

    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    (usePWAInstallHook.usePWAInstall as ReturnType<typeof vi.fn>).mockReturnValue({
      showInstallPrompt: false,
      installApp: mockInstallApp,
      canInstall: false,
    });

    const { container } = render(<InstallModal />);
    expect(container.firstChild).toBeNull();
  });
});

