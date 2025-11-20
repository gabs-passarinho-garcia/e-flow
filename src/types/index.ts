/**
 * Type definitions for E-Flow application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  available: boolean;
  connectorType: ConnectorType[];
  power: number; // kW
  pricePerKwh: number;
  rating: number;
  imageUrl?: string;
}

export type ConnectorType = 
  | 'Type 1 (J1772)'
  | 'Type 2 (Mennekes)'
  | 'CCS (Combo)'
  | 'CHAdeMO'
  | 'Tesla Supercharger';

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'pix';
  last4?: string;
  brand?: string;
}

export interface Payment {
  id: string;
  stationId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
}

export interface ChargingSession {
  id: string;
  stationId: string;
  userId: string;
  paymentId: string;
  startTime: Date;
  endTime?: Date;
  energyDelivered: number; // kWh
  currentBattery: number; // percentage
  estimatedTimeRemaining: number; // minutes
  status: 'starting' | 'charging' | 'completed' | 'cancelled';
}

