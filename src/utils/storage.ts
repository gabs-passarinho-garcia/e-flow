/**
 * Utility functions for localStorage operations
 */

const STORAGE_KEYS = {
  USER: 'e-flow_user',
  SESSION: 'e-flow_session',
  PAYMENT: 'e-flow_payment',
} as const;

/**
 * Date property names that should be converted from strings to Date objects
 */
const DATE_PROPERTIES = ['startTime', 'endTime', 'timestamp'] as const;

/**
 * Recursively converts date strings to Date objects in an object
 * @param obj - The object to process
 * @returns The object with date strings converted to Date objects
 */
const reviveDates = <T>(obj: unknown): T => {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => reviveDates(item)) as T;
  }

  if (typeof obj === 'object') {
    const revived = {} as Record<string, unknown>;
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(obj)) {
      if (DATE_PROPERTIES.includes(key as (typeof DATE_PROPERTIES)[number])) {
        // Convert date string to Date object
        revived[key] = value ? new Date(value as string) : value;
      } else if (typeof value === 'object' && value !== null) {
        // Recursively process nested objects
        revived[key] = reviveDates(value);
      } else {
        revived[key] = value;
      }
    }
    return revived as T;
  }

  return obj as T;
};

export const storage = {
  /**
   * Save user data to localStorage
   */
  saveUser: (user: unknown): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Get user data from localStorage
   */
  getUser: <T>(): T | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? reviveDates<T>(JSON.parse(data)) : null;
  },

  /**
   * Remove user data from localStorage
   */
  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Save charging session to localStorage
   */
  saveSession: (session: unknown): void => {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  },

  /**
   * Get charging session from localStorage
   */
  getSession: <T>(): T | null => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? reviveDates<T>(JSON.parse(data)) : null;
  },

  /**
   * Remove charging session from localStorage
   */
  removeSession: (): void => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  /**
   * Save payment data to localStorage
   */
  savePayment: (payment: unknown): void => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT, JSON.stringify(payment));
  },

  /**
   * Get payment data from localStorage
   */
  getPayment: <T>(): T | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENT);
    return data ? reviveDates<T>(JSON.parse(data)) : null;
  },

  /**
   * Remove payment data from localStorage
   */
  removePayment: (): void => {
    localStorage.removeItem(STORAGE_KEYS.PAYMENT);
  },
};
