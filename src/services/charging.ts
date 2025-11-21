import type { ChargingSession } from '../types';
import { storage } from '../utils/storage';

/**
 * Mock charging service
 * Simulates charging session and progress
 */

let chargingInterval: ReturnType<typeof setInterval> | null = null;
let currentSession: ChargingSession | null = null;
let progressCallback: ((session: ChargingSession) => void) | null = null;

/**
 * Start a charging session
 */
export const startCharging = async (
  stationId: string,
  userId: string,
  paymentId: string,
): Promise<ChargingSession> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const session: ChargingSession = {
    id: `session_${Date.now()}`,
    stationId,
    userId,
    paymentId,
    startTime: new Date(),
    energyDelivered: 0,
    currentBattery: 20, // Start at 20%
    estimatedTimeRemaining: 45, // 45 minutes
    status: 'starting',
  };

  currentSession = session;
  storage.saveSession(session);

  // Simulate charging progress
  setTimeout(() => {
    session.status = 'charging';
    storage.saveSession(session);

    chargingInterval = setInterval(() => {
      if (!currentSession) return;

      // Increase battery by ~2% every 2 seconds
      currentSession.currentBattery = Math.min(currentSession.currentBattery + 2, 100);

      // Decrease estimated time
      currentSession.estimatedTimeRemaining = Math.max(
        currentSession.estimatedTimeRemaining - 1,
        0,
      );

      // Increase energy delivered
      currentSession.energyDelivered += 0.5;

      // Check if charging is complete
      if (currentSession.currentBattery >= 100) {
        currentSession.status = 'completed';
        currentSession.endTime = new Date();
        if (chargingInterval) {
          clearInterval(chargingInterval);
          chargingInterval = null;
        }
      }

      storage.saveSession(currentSession);

      if (progressCallback) {
        progressCallback({ ...currentSession });
      }
    }, 2000);
  }, 2000);

  return session;
};

/**
 * Get current charging session
 */
export const getCurrentSession = async (): Promise<ChargingSession | null> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return storage.getSession<ChargingSession>() || currentSession;
};

/**
 * Cancel charging session
 */
export const cancelCharging = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (currentSession) {
    currentSession.status = 'cancelled';
    currentSession.endTime = new Date();
    storage.saveSession(currentSession);
  }

  if (chargingInterval) {
    clearInterval(chargingInterval);
    chargingInterval = null;
  }

  currentSession = null;
};

/**
 * Subscribe to charging progress updates
 */
export const onChargingProgress = (callback: (session: ChargingSession) => void): (() => void) => {
  progressCallback = callback;

  // Return unsubscribe function
  return () => {
    progressCallback = null;
  };
};

/**
 * Reset charging service state (for testing)
 */
export const resetChargingState = (): void => {
  if (chargingInterval) {
    clearInterval(chargingInterval);
    chargingInterval = null;
  }
  currentSession = null;
  progressCallback = null;
};
