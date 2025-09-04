import { useState, useEffect, useCallback } from 'react';

interface SyncState {
  lastUpdate: Date | null;
  isOnline: boolean;
}

interface UseContentfulSyncReturn extends SyncState {
  triggerSync: () => Promise<void>;
}

// Simple sync hook for Contentful content
export function useContentfulSync(): UseContentfulSyncReturn {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Trigger manual sync
  const triggerSync = useCallback(async () => {
    if (!isOnline) {
      console.warn('Cannot sync while offline');
      return;
    }

    try {
      // Here you could implement actual sync logic
      // For now, just update the timestamp
      setLastUpdate(new Date());

      // In a real implementation, you might:
      // 1. Fetch latest content from Contentful
      // 2. Update local cache
      // 3. Notify other components of changes
      console.log('Contentful sync triggered');
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }, [isOnline]);

  // Auto-sync on mount and when coming back online
  useEffect(() => {
    if (isOnline) {
      triggerSync();
    }
  }, [isOnline, triggerSync]);

  // Periodic sync (every 5 minutes when online)
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      triggerSync();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isOnline, triggerSync]);

  return {
    lastUpdate,
    isOnline,
    triggerSync,
  };
}

// Utility function to check if content needs refresh
export function shouldRefreshContent(lastUpdate: Date | null, maxAge: number = 5 * 60 * 1000): boolean {
  if (!lastUpdate) return true;
  return Date.now() - lastUpdate.getTime() > maxAge;
}

// Content cache management
class ContentCache {
  private cache = new Map<string, { data: unknown; timestamp: Date }>();
  private readonly maxAge: number;

  constructor(maxAge: number = 10 * 60 * 1000) { // 10 minutes default
    this.maxAge = maxAge;
  }

  set(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
    });
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp.getTime() > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp.getTime() > this.maxAge) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

// Global content cache instance
export const contentCache = new ContentCache();

// Sync manager for coordinating multiple sync operations
export class SyncManager {
  private syncCallbacks: Set<() => void> = new Set();
  private isSyncing = false;

  subscribe(callback: () => void): () => void {
    this.syncCallbacks.add(callback);
    return () => {
      this.syncCallbacks.delete(callback);
    };
  }

  async sync(): Promise<void> {
    if (this.isSyncing) return;

    this.isSyncing = true;
    try {
      // Perform sync operations here
      console.log('Starting content sync...');

      // Notify all subscribers
      this.syncCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in sync callback:', error);
        }
      });

      console.log('Content sync completed');
    } finally {
      this.isSyncing = false;
    }
  }

  get isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }
}

// Global sync manager instance
export const syncManager = new SyncManager();