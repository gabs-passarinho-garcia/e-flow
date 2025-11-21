import type { User } from '../types';
import { storage } from '../utils/storage';

/**
 * Mock authentication service
 * Simulates user login and authentication
 */

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '+55 11 99999-9999',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '+55 11 88888-8888',
  },
];

/**
 * Mock login function
 * Accepts any email/password combination and returns a user
 */
export const login = async (
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _password: string,
): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Find user or create a new one
  let user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    user = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
    };
    MOCK_USERS.push(user);
  }

  // Save to localStorage
  storage.saveUser(user);

  return user;
};

/**
 * Mock logout function
 */
export const logout = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  storage.removeUser();
  storage.removeSession();
  storage.removePayment();
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return storage.getUser<User>();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
