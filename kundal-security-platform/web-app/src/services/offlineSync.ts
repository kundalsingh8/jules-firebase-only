import { db } from './firebase';
import { collection, addDoc, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

// In a real application, we would use localForage or a more robust IndexedDB wrapper.
// Here we set up a basic offline queue pattern.
const QUEUE_KEY = 'kundal_offline_queue';

interface QueueItem {
  id: string;
  collectionPath: string;
  operation: 'add' | 'set' | 'update' | 'delete';
  data?: any;
  docId?: string;
  timestamp: number;
}

export class OfflineSyncService {
  private queue: QueueItem[] = [];

  constructor() {
    this.loadQueue();
    window.addEventListener('online', this.processQueue.bind(this));
  }

  private loadQueue() {
    const savedQueue = localStorage.getItem(QUEUE_KEY);
    if (savedQueue) {
      try {
        this.queue = JSON.parse(savedQueue);
      } catch (e) {
        this.queue = [];
      }
    }
  }

  private saveQueue() {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
  }

  public async enqueueOperation(collectionPath: string, operation: 'add' | 'set' | 'update' | 'delete', data?: any, docId?: string) {
    if (navigator.onLine) {
        // Direct execution if online
        try {
           return await this.executeOperation(collectionPath, operation, data, docId);
        } catch (e) {
            console.error("Online execution failed, queuing...", e);
            // fallback to queue
        }
    }

    const item: QueueItem = {
      id: crypto.randomUUID(),
      collectionPath,
      operation,
      data,
      docId,
      timestamp: Date.now()
    };

    this.queue.push(item);
    this.saveQueue();

    return { queued: true, tempId: item.id };
  }

  private async executeOperation(collectionPath: string, operation: 'add' | 'set' | 'update' | 'delete', data?: any, docId?: string) {
      if (operation === 'add') {
          return await addDoc(collection(db, collectionPath), data);
      } else if (operation === 'set' && docId) {
          return await setDoc(doc(db, collectionPath, docId), data);
      } else if (operation === 'delete' && docId) {
          return await deleteDoc(doc(db, collectionPath, docId));
      }
      throw new Error("Unsupported operation or missing docId");
  }

  public async processQueue() {
    if (!navigator.onLine || this.queue.length === 0) return;

    console.log(`Processing offline queue: ${this.queue.length} items`);

    const failedItems: QueueItem[] = [];

    for (const item of this.queue) {
      try {
        await this.executeOperation(item.collectionPath, item.operation, item.data, item.docId);
      } catch (error) {
        console.error("Failed to process queue item", item, error);
        failedItems.push(item);
      }
    }

    this.queue = failedItems;
    this.saveQueue();
  }
}

export const offlineSync = new OfflineSyncService();
