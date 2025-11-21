/**
 * Unit tests for payment service
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'bun:test';
import { processPayment, getPaymentById, getPaymentMethods } from '../payment';
import { storage } from '../../utils/storage';
import type { Payment, PaymentMethod } from '../../types';

describe('Payment Service', () => {
  beforeEach(() => {
    storage.removePayment();
    // Clear any mocks that might interfere
    vi.clearAllMocks();
  });

  afterEach(() => {
    storage.removePayment();
  });

  describe('processPayment', () => {
    it('should process a payment with credit card', async () => {
      const method: PaymentMethod = {
        id: '1',
        type: 'credit',
        last4: '4242',
        brand: 'Visa',
      };

      const payment = await processPayment('station-1', 'user-1', 50.0, method);

      expect(payment).toBeDefined();
      expect(payment.id).toContain('pay_');
      expect(payment.stationId).toBe('station-1');
      expect(payment.userId).toBe('user-1');
      expect(payment.amount).toBe(50.0);
      expect(payment.method).toEqual(method);
      expect(payment.status).toBe('completed');
      expect(payment.timestamp).toBeInstanceOf(Date);
    });

    it('should process a payment with debit card', async () => {
      const method: PaymentMethod = {
        id: '2',
        type: 'debit',
        last4: '8888',
        brand: 'Mastercard',
      };

      const payment = await processPayment('station-2', 'user-2', 75.5, method);

      expect(payment.method.type).toBe('debit');
      expect(payment.amount).toBe(75.5);
    });

    it('should process a payment with PIX', async () => {
      const method: PaymentMethod = {
        id: '3',
        type: 'pix',
      };

      const payment = await processPayment('station-3', 'user-3', 30.0, method);

      expect(payment.method.type).toBe('pix');
      expect(payment.method.last4).toBeUndefined();
      expect(payment.method.brand).toBeUndefined();
    });

    it('should save payment to storage', async () => {
      const method: PaymentMethod = {
        id: '1',
        type: 'credit',
        last4: '4242',
        brand: 'Visa',
      };

      await processPayment('station-1', 'user-1', 50.0, method);
      const savedPayment = storage.getPayment<Payment>();

      expect(savedPayment).toBeDefined();
      expect(savedPayment?.stationId).toBe('station-1');
      expect(savedPayment?.amount).toBe(50.0);
      expect(savedPayment?.status).toBe('completed');
    });

    it('should generate unique payment IDs', async () => {
      const method: PaymentMethod = {
        id: '1',
        type: 'credit',
        last4: '4242',
        brand: 'Visa',
      };

      const payment1 = await processPayment('station-1', 'user-1', 50.0, method);
      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));
      const payment2 = await processPayment('station-1', 'user-1', 50.0, method);

      expect(payment1.id).not.toBe(payment2.id);
    });
  });

  describe('getPaymentById', () => {
    it('should return payment from storage', async () => {
      const method: PaymentMethod = {
        id: '1',
        type: 'credit',
        last4: '4242',
        brand: 'Visa',
      };

      const createdPayment = await processPayment('station-1', 'user-1', 50.0, method);
      const retrievedPayment = await getPaymentById(createdPayment.id);

      expect(retrievedPayment).toBeDefined();
      expect(retrievedPayment?.id).toBe(createdPayment.id);
      expect(retrievedPayment?.amount).toBe(50.0);
    });

    it('should return null when no payment exists', async () => {
      const payment = await getPaymentById('non-existent-id');
      expect(payment).toBeNull();
    });
  });

  describe('getPaymentMethods', () => {
    it('should return list of payment methods', async () => {
      const methods = await getPaymentMethods();

      expect(methods).toBeDefined();
      expect(Array.isArray(methods)).toBe(true);
      expect(methods.length).toBe(3);
    });

    it('should include credit card method', async () => {
      const methods = await getPaymentMethods();
      const creditMethod = methods.find((m) => m.type === 'credit');

      expect(creditMethod).toBeDefined();
      expect(creditMethod?.id).toBe('1');
      expect(creditMethod?.last4).toBe('4242');
      expect(creditMethod?.brand).toBe('Visa');
    });

    it('should include debit card method', async () => {
      const methods = await getPaymentMethods();
      const debitMethod = methods.find((m) => m.type === 'debit');

      expect(debitMethod).toBeDefined();
      expect(debitMethod?.id).toBe('2');
      expect(debitMethod?.last4).toBe('8888');
      expect(debitMethod?.brand).toBe('Mastercard');
    });

    it('should include PIX method', async () => {
      const methods = await getPaymentMethods();
      const pixMethod = methods.find((m) => m.type === 'pix');

      expect(pixMethod).toBeDefined();
      expect(pixMethod?.id).toBe('3');
      expect(pixMethod?.last4).toBeUndefined();
      expect(pixMethod?.brand).toBeUndefined();
    });
  });
});

