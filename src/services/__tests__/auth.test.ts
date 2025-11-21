/**
 * Unit tests for authentication service
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test';
import { login, logout, getCurrentUser, isAuthenticated } from '../auth';
import { storage } from '../../utils/storage';
import type { User } from '../../types';

describe('Auth Service', () => {
  beforeEach(() => {
    storage.removeUser();
    storage.removeSession();
    storage.removePayment();
    // Clear any mocks that might interfere
    vi.clearAllMocks();
  });

  afterEach(() => {
    storage.removeUser();
    storage.removeSession();
    storage.removePayment();
  });

  describe('login', () => {
    it('should login with existing user email', async () => {
      const user = await login('joao@example.com', 'password123');

      expect(user).toBeDefined();
      expect(user.email).toBe('joao@example.com');
      expect(user.name).toBe('João Silva');
      expect(storage.getUser<User>()).toEqual(user);
    });

    it('should create new user if email does not exist', async () => {
      const user = await login('newuser@example.com', 'password123');

      expect(user).toBeDefined();
      expect(user.email).toBe('newuser@example.com');
      expect(user.name).toBe('newuser');
      expect(storage.getUser<User>()).toEqual(user);
    });

    it('should save user to localStorage after login', async () => {
      await login('maria@example.com', 'password123');
      const savedUser = storage.getUser<User>();

      expect(savedUser).toBeDefined();
      expect(savedUser?.email).toBe('maria@example.com');
    });
  });

  describe('logout', () => {
    it('should remove user data from storage', async () => {
      await login('joao@example.com', 'password123');
      expect(isAuthenticated()).toBe(true);

      await logout();

      expect(storage.getUser()).toBeNull();
      expect(isAuthenticated()).toBe(false);
    });

    it('should remove session and payment data', async () => {
      await login('joao@example.com', 'password123');
      storage.saveSession({ id: 'session-1' });
      storage.savePayment({ id: 'payment-1' });

      await logout();

      expect(storage.getSession()).toBeNull();
      expect(storage.getPayment()).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      expect(getCurrentUser()).toBeNull();
    });

    it('should return current user when logged in', async () => {
      const user = await login('joao@example.com', 'password123');
      const currentUser = getCurrentUser();

      expect(currentUser).toEqual(user);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user is logged in', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true when user is logged in', async () => {
      await login('joao@example.com', 'password123');
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false after logout', async () => {
      await login('joao@example.com', 'password123');
      await logout();
      expect(isAuthenticated()).toBe(false);
    });
  });
});

