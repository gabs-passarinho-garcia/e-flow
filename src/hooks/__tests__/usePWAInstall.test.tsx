/**
 * Unit tests for usePWAInstall hook
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test';
import { renderHook, waitFor } from '@testing-library/react';
import { usePWAInstall } from '../usePWAInstall';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

describe('usePWAInstall Hook', () => {
  let mockPrompt: () => Promise<void>;
  let mockUserChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  let mockMatchMedia: (query: string) => MediaQueryList;

  beforeEach(() => {
    // Reset mocks
    mockPrompt = async () => {};
    mockUserChoice = Promise.resolve({ outcome: 'accepted' as const });

    // Mock matchMedia
    mockMatchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    // Clean up event listeners
    const events = (window as unknown as { _events?: Event[] })._events || [];
    events.forEach(() => {
      window.removeEventListener('beforeinstallprompt', () => {});
    });
  });

  it('should return showInstallPrompt as false initially', () => {
    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.showInstallPrompt).toBe(false);
    expect(result.current.canInstall).toBe(false);
  });

  it('should return canInstall as false when no deferredPrompt', () => {
    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.canInstall).toBe(false);
  });

  it('should set showInstallPrompt to true when beforeinstallprompt event fires', async () => {
    const { result } = renderHook(() => usePWAInstall());

    // Create and dispatch beforeinstallprompt event
    const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
    event.preventDefault = () => {};
    event.prompt = mockPrompt;
    event.userChoice = mockUserChoice;

    window.dispatchEvent(event);

    await waitFor(() => {
      expect(result.current.showInstallPrompt).toBe(true);
      expect(result.current.canInstall).toBe(true);
    });
  });

  it('should call installApp and update state when prompt is accepted', async () => {
    mockUserChoice = Promise.resolve({ outcome: 'accepted' as const });
    const { result } = renderHook(() => usePWAInstall());

    // Trigger beforeinstallprompt event
    const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
    event.preventDefault = () => {};
    event.prompt = mockPrompt;
    event.userChoice = mockUserChoice;

    window.dispatchEvent(event);

    await waitFor(() => {
      expect(result.current.showInstallPrompt).toBe(true);
    });

    // Call installApp
    await result.current.installApp();

    await waitFor(() => {
      expect(result.current.showInstallPrompt).toBe(false);
      expect(result.current.canInstall).toBe(false);
    });
  });

  it('should call installApp and update state when prompt is dismissed', async () => {
    mockUserChoice = Promise.resolve({ outcome: 'dismissed' as const });
    const { result } = renderHook(() => usePWAInstall());

    // Trigger beforeinstallprompt event
    const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
    event.preventDefault = () => {};
    event.prompt = mockPrompt;
    event.userChoice = mockUserChoice;

    window.dispatchEvent(event);

    await waitFor(() => {
      expect(result.current.showInstallPrompt).toBe(true);
    });

    // Call installApp
    await result.current.installApp();

    await waitFor(() => {
      expect(result.current.showInstallPrompt).toBe(false);
      expect(result.current.canInstall).toBe(false);
    });
  });

  it('should not call prompt if deferredPrompt is null', async () => {
    const { result } = renderHook(() => usePWAInstall());

    let promptCalled = false;
    mockPrompt = async () => {
      promptCalled = true;
    };

    // Try to install without deferredPrompt
    await result.current.installApp();

    expect(promptCalled).toBe(false);
    expect(result.current.showInstallPrompt).toBe(false);
  });

  it('should detect app already installed via matchMedia', () => {
    // Mock matchMedia to return matches: true for standalone
    mockMatchMedia = (query: string) => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const { result } = renderHook(() => usePWAInstall());

    // Should not show prompt if already installed
    expect(result.current.showInstallPrompt).toBe(false);
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => usePWAInstall());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});

