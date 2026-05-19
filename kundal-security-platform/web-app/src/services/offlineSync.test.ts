import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OfflineSyncService } from './offlineSync';

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-1234'
});

// Create a spy for localStorage to verify save Queue
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

// Mock the network state
const navigatorMock = {
  onLine: false
};
vi.stubGlobal('navigator', navigatorMock);


describe('OfflineSyncService', () => {
  let service: OfflineSyncService;

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    navigatorMock.onLine = false; // default to offline

    // We need to subclass to expose private methods or we can use vi.spyOn on the prototype
    service = new OfflineSyncService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('processQueue', () => {
    it('should process queue and clear it when operations succeed', async () => {
      // Mock executeOperation to resolve successfully
      const executeOperationSpy = vi.spyOn(service as any, 'executeOperation').mockResolvedValue(undefined);

      // Enqueue an item (will go to queue because navigator is offline)
      await service.enqueueOperation('test-collection', 'add', { data: 'test' });

      // Simulate going online
      navigatorMock.onLine = true;

      // We expect the queue to have 1 item before processing
      expect((service as any).queue.length).toBe(1);

      // Process queue
      await service.processQueue();

      // Verify executeOperation was called
      expect(executeOperationSpy).toHaveBeenCalledTimes(1);
      expect(executeOperationSpy).toHaveBeenCalledWith('test-collection', 'add', { data: 'test' }, undefined);

      // Verify queue is empty after success
      expect((service as any).queue.length).toBe(0);

      // Verify local storage was updated with empty queue
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith('kundal_offline_queue', '[]');
    });

    it('should keep failed items in queue and save to localStorage', async () => {
      // Mock executeOperation to throw an error
      const mockError = new Error('Network error during operation');
      const executeOperationSpy = vi.spyOn(service as any, 'executeOperation').mockRejectedValue(mockError);

      // Suppress console.error for this expected failure
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Enqueue an item
      await service.enqueueOperation('test-collection', 'add', { data: 'test' });

      // Simulate going online
      navigatorMock.onLine = true;

      // Verify queue has 1 item
      expect((service as any).queue.length).toBe(1);

      // Process queue
      await service.processQueue();

      // Verify executeOperation was called
      expect(executeOperationSpy).toHaveBeenCalledTimes(1);

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to process queue item", expect.any(Object), mockError);

      // Verify queue still has the item
      expect((service as any).queue.length).toBe(1);

      // Verify local storage was updated with the queue containing the failed item
      const queueString = JSON.stringify((service as any).queue);
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith('kundal_offline_queue', queueString);
    });
  });
});
