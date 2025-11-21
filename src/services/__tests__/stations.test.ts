/**
 * Unit tests for stations service
 */
import { describe, it, expect, beforeEach, vi } from 'bun:test';
import { getAllStations, getStationById, getAvailableStations } from '../stations';

describe('Stations Service', () => {
  beforeEach(() => {
    // Clear any mocks that might interfere
    vi.clearAllMocks();
  });
  describe('getAllStations', () => {
    it('should return all stations', async () => {
      const stations = await getAllStations();

      expect(stations).toBeDefined();
      expect(Array.isArray(stations)).toBe(true);
      expect(stations.length).toBe(9);
    });

    it('should return stations with all required properties', async () => {
      const stations = await getAllStations();
      const firstStation = stations[0];

      expect(firstStation).toHaveProperty('id');
      expect(firstStation).toHaveProperty('name');
      expect(firstStation).toHaveProperty('address');
      expect(firstStation).toHaveProperty('latitude');
      expect(firstStation).toHaveProperty('longitude');
      expect(firstStation).toHaveProperty('available');
      expect(firstStation).toHaveProperty('connectorType');
      expect(firstStation).toHaveProperty('power');
      expect(firstStation).toHaveProperty('pricePerKwh');
      expect(firstStation).toHaveProperty('rating');
    });

    it('should return a copy of stations array', async () => {
      const stations1 = await getAllStations();
      const stations2 = await getAllStations();

      expect(stations1).not.toBe(stations2); // Different array references
      expect(stations1).toEqual(stations2); // Same content
    });

    it('should include stations from ABC Paulista region', async () => {
      const stations = await getAllStations();
      const abcStations = stations.filter((s) =>
        s.address.includes('Santo André') || s.address.includes('São Bernardo') || s.address.includes('São Caetano'),
      );

      expect(abcStations.length).toBeGreaterThan(0);
    });
  });

  describe('getStationById', () => {
    it('should return station by ID', async () => {
      const station = await getStationById('1');

      expect(station).toBeDefined();
      expect(station?.id).toBe('1');
      expect(station?.name).toBe('Estação Shopping Center Norte');
    });

    it('should return null for non-existent station', async () => {
      const station = await getStationById('999');

      expect(station).toBeNull();
    });

    it('should return station with correct connector types', async () => {
      const station = await getStationById('4');

      expect(station).toBeDefined();
      expect(station?.connectorType).toContain('Type 2 (Mennekes)');
      expect(station?.connectorType).toContain('CCS (Combo)');
      expect(station?.connectorType).toContain('CHAdeMO');
    });

    it('should return station with correct power and pricing', async () => {
      const station = await getStationById('3');

      expect(station).toBeDefined();
      expect(station?.power).toBe(150);
      expect(station?.pricePerKwh).toBe(1.2);
      expect(station?.rating).toBe(4.2);
    });
  });

  describe('getAvailableStations', () => {
    it('should return only available stations', async () => {
      const availableStations = await getAvailableStations();

      expect(availableStations).toBeDefined();
      expect(Array.isArray(availableStations)).toBe(true);
      expect(availableStations.length).toBeLessThan(9); // Some stations are unavailable
    });

    it('should filter out unavailable stations', async () => {
      const availableStations = await getAvailableStations();
      const allStations = await getAllStations();

      const unavailableCount = allStations.filter((s) => !s.available).length;
      expect(availableStations.length).toBe(allStations.length - unavailableCount);
    });

    it('should only include stations with available: true', async () => {
      const availableStations = await getAvailableStations();

      availableStations.forEach((station) => {
        expect(station.available).toBe(true);
      });
    });

    it('should exclude station with id 3 (unavailable)', async () => {
      const availableStations = await getAvailableStations();
      const unavailableStation = availableStations.find((s) => s.id === '3');

      expect(unavailableStation).toBeUndefined();
    });

    it('should exclude station with id 8 (unavailable)', async () => {
      const availableStations = await getAvailableStations();
      const unavailableStation = availableStations.find((s) => s.id === '8');

      expect(unavailableStation).toBeUndefined();
    });
  });
});

