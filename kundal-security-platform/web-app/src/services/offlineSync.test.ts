import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OfflineSyncService } from './offlineSync';

// Mock the firebase firestore functions
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    addDoc: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn()
  };
});

vi.mock('./firebase', () => {
  return {
    db: {}
  };
});

describe('OfflineSyncService executeOperation', () => {
    let service: OfflineSyncService;

    beforeEach(() => {
        service = new OfflineSyncService();
    });

    it('should throw an error for unsupported operation', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await expect((service as any).executeOperation('my-collection', 'unsupported-op', { some: 'data' })).rejects.toThrow('Unsupported operation or missing docId');
    });

    it('should throw an error for missing docId when operation is set', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await expect((service as any).executeOperation('my-collection', 'set', { some: 'data' })).rejects.toThrow('Unsupported operation or missing docId');
    });

    it('should throw an error for missing docId when operation is delete', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await expect((service as any).executeOperation('my-collection', 'delete')).rejects.toThrow('Unsupported operation or missing docId');
    });

    it('should throw an error for missing docId when operation is update', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await expect((service as any).executeOperation('my-collection', 'update')).rejects.toThrow('Unsupported operation or missing docId');
    });
});
