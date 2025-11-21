/**
 * Unit tests for storage utility
 */
import { describe, it, expect, beforeEach } from 'bun:test';
import { storage } from '../storage';
import type { User, ChargingSession, Payment } from '../../types';

describe('Storage Utility', () => {
  beforeEach(() => {
    storage.removeUser();
    storage.removeSession();
    storage.removePayment();
  });

  describe('User operations', () => {
    it('should save and retrieve user data', () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+55 11 99999-9999',
      };

      storage.saveUser(user);
      const retrieved = storage.getUser<User>();

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('1');
      expect(retrieved?.name).toBe('John Doe');
      expect(retrieved?.email).toBe('john@example.com');
      expect(retrieved?.phone).toBe('+55 11 99999-9999');
    });

    it('should return null when no user exists', () => {
      const user = storage.getUser<User>();
      expect(user).toBeNull();
    });

    it('should remove user data', () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      storage.saveUser(user);
      expect(storage.getUser<User>()).toBeDefined();

      storage.removeUser();
      expect(storage.getUser<User>()).toBeNull();
    });

    it('should handle user without optional fields', () => {
      const user: User = {
        id: '1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      storage.saveUser(user);
      const retrieved = storage.getUser<User>();

      expect(retrieved?.phone).toBeUndefined();
    });
  });

  describe('Session operations', () => {
    it('should save and retrieve charging session', () => {
      const session: ChargingSession = {
        id: 'session-1',
        stationId: 'station-1',
        userId: 'user-1',
        paymentId: 'payment-1',
        startTime: new Date(),
        energyDelivered: 10.5,
        currentBattery: 50,
        estimatedTimeRemaining: 30,
        status: 'charging',
      };

      storage.saveSession(session);
      const retrieved = storage.getSession<ChargingSession>();

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('session-1');
      expect(retrieved?.stationId).toBe('station-1');
      expect(retrieved?.status).toBe('charging');
      expect(retrieved?.currentBattery).toBe(50);
      expect(retrieved?.energyDelivered).toBe(10.5);
    });

    it('should return null when no session exists', () => {
      const session = storage.getSession<ChargingSession>();
      expect(session).toBeNull();
    });

    it('should remove session data', () => {
      const session: ChargingSession = {
        id: 'session-1',
        stationId: 'station-1',
        userId: 'user-1',
        paymentId: 'payment-1',
        startTime: new Date(),
        energyDelivered: 0,
        currentBattery: 20,
        estimatedTimeRemaining: 45,
        status: 'starting',
      };

      storage.saveSession(session);
      expect(storage.getSession<ChargingSession>()).toBeDefined();

      storage.removeSession();
      expect(storage.getSession<ChargingSession>()).toBeNull();
    });

    it('should handle session with endTime', () => {
      const session: ChargingSession = {
        id: 'session-1',
        stationId: 'station-1',
        userId: 'user-1',
        paymentId: 'payment-1',
        startTime: new Date('2024-01-01'),
        endTime: new Date('2024-01-01'),
        energyDelivered: 25.0,
        currentBattery: 100,
        estimatedTimeRemaining: 0,
        status: 'completed',
      };

      storage.saveSession(session);
      const retrieved = storage.getSession<ChargingSession>();

      expect(retrieved?.endTime).toBeInstanceOf(Date);
      expect(retrieved?.status).toBe('completed');
    });
  });

  describe('Payment operations', () => {
    it('should save and retrieve payment data', () => {
      const payment: Payment = {
        id: 'payment-1',
        stationId: 'station-1',
        userId: 'user-1',
        amount: 50.0,
        method: {
          id: '1',
          type: 'credit',
          last4: '4242',
          brand: 'Visa',
        },
        status: 'completed',
        timestamp: new Date(),
      };

      storage.savePayment(payment);
      const retrieved = storage.getPayment<Payment>();

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('payment-1');
      expect(retrieved?.amount).toBe(50.0);
      expect(retrieved?.status).toBe('completed');
      expect(retrieved?.method.type).toBe('credit');
    });

    it('should return null when no payment exists', () => {
      const payment = storage.getPayment<Payment>();
      expect(payment).toBeNull();
    });

    it('should remove payment data', () => {
      const payment: Payment = {
        id: 'payment-1',
        stationId: 'station-1',
        userId: 'user-1',
        amount: 50.0,
        method: {
          id: '1',
          type: 'credit',
          last4: '4242',
          brand: 'Visa',
        },
        status: 'completed',
        timestamp: new Date(),
      };

      storage.savePayment(payment);
      expect(storage.getPayment<Payment>()).toBeDefined();

      storage.removePayment();
      expect(storage.getPayment<Payment>()).toBeNull();
    });

    it('should handle payment with PIX method', () => {
      const payment: Payment = {
        id: 'payment-1',
        stationId: 'station-1',
        userId: 'user-1',
        amount: 30.0,
        method: {
          id: '3',
          type: 'pix',
        },
        status: 'completed',
        timestamp: new Date(),
      };

      storage.savePayment(payment);
      const retrieved = storage.getPayment<Payment>();

      expect(retrieved?.method.type).toBe('pix');
      expect(retrieved?.method.last4).toBeUndefined();
    });
  });

  describe('JSON serialization', () => {
    it('should properly serialize and deserialize complex objects', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+55 11 99999-9999',
      };

      storage.saveUser(user);
      const retrieved = storage.getUser<User>();

      expect(retrieved).toEqual(user);
    });

    it('should handle Date objects in serialization', () => {
      const session: ChargingSession = {
        id: 'session-1',
        stationId: 'station-1',
        userId: 'user-1',
        paymentId: 'payment-1',
        startTime: new Date('2024-01-01T10:00:00Z'),
        energyDelivered: 0,
        currentBattery: 20,
        estimatedTimeRemaining: 45,
        status: 'starting',
      };

      storage.saveSession(session);
      const retrieved = storage.getSession<ChargingSession>();

      expect(retrieved?.startTime).toBeInstanceOf(Date);
      // Note: JSON serialization converts dates to strings, so we need to check the value
      expect(retrieved?.startTime.getTime()).toBe(new Date('2024-01-01T10:00:00Z').getTime());
    });
  });
});

