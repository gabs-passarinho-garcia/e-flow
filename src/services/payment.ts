import type { Payment, PaymentMethod } from '../types';
import { storage } from '../utils/storage';

/**
 * Mock payment service
 * Simulates payment processing
 */

/**
 * Process a payment
 */
export const processPayment = async (
  stationId: string,
  userId: string,
  amount: number,
  method: PaymentMethod
): Promise<Payment> => {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const payment: Payment = {
    id: `pay_${Date.now()}`,
    stationId,
    userId,
    amount,
    method,
    status: 'completed',
    timestamp: new Date(),
  };

  // Save payment to localStorage
  storage.savePayment(payment);

  return payment;
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (id: string): Promise<Payment | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return storage.getPayment<Payment>();
};

/**
 * Mock payment methods for the user
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      type: 'credit',
      last4: '4242',
      brand: 'Visa',
    },
    {
      id: '2',
      type: 'debit',
      last4: '8888',
      brand: 'Mastercard',
    },
    {
      id: '3',
      type: 'pix',
    },
  ];
};

