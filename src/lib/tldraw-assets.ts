import { TLAsset, TLAssetStore, FileHelpers } from 'tldraw'
import { supabase } from '@/integrations/supabase/client'
import { 
  saveAsset as saveOfflineAsset, 
  getAsset as getOfflineAsset,
  getAssetData as getOfflineAssetData,
  deleteAsset as deleteOfflineAsset
} from './offline-db'
import { v4 as uuidv4 } from 'uuid'

// Asset store for tldraw that supports offline and online mode
export class WitepadAssetStore implements TLAssetStore {
  userId: string | null;
  isOnline: boolean;
  private assetCache: Map<string, string>; // Cache for resolved URLs

  constructor(userId: string | null) {
    this.userId = userId;
    this.isOnline = navigator.onLine;
    this.assetCache = new Map();

    // Listen for online/offline events
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  // Cleanup method
  cleanup() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
    
    // Revoke cached object URLs to prevent memory leaks
    this.assetCache.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.assetCache.clear();
  }

  private handleOnlineStatus = () => {
    this.isOnline = navigator.onLine;
  }

  // Helper to create blob URL from asset data
  private async createBlobUrl(blob: Blob, type: string): Promise<string> {
    const url = URL.createObjectURL(
      new Blob([blob], { type: this.getMimeType(type) })
    );
    return url;
  }

  // Get MIME type based on asset type
  private getMimeType(type: string): string {
    switch (type) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/svg+xml':
      case 'image/gif':
      case 'image/webp':
        return type;
      case 'video/mp4':
      case 'video/webm':
      case 'video/quicktime':
        return type;
      default:
        return 'application/octet-stream';
    }
  }
  
  // Create a unique asset ID
  private generateAssetId(): string {
    return `asset:${uuidv4()}`;
  }
  /**
   * Required TLAssetStore method to upload assets.
   * This method uploads a file and returns the metadata needed by tldraw.
   */
  async upload(
    asset: TLAsset,
    file: File,
    abortSignal?: AbortSignal
  ): Promise<{ src: string; meta?: Record<string, any> }> {
    try {
      const id = asset.id || this.generateAssetId();
      const result = await this.uploadAsset(file, id);
      
      // Create a temporary URL for immediate use
      const blobUrl = URL.createObjectURL(file);
      
      // Cache the temporary URL to avoid repeated processing
      this.assetCache.set(id, blobUrl);
      
      return {
        src: blobUrl,
        meta: {
          size: file.size,
          type: file.type,
          name: file.name
        }
      };
    } catch (error) {
      console.error('Error in upload:', error);
      throw new Error(`Failed to upload asset: ${error}`);
    }
  }

  /**
   * Upload an asset to both offline storage and Supabase when online.
   * This is our internal implementation used by the TLAssetStore upload method.
   */
  private async uploadAsset(file: File, id?: string): Promise<string | null> {
    try {
      const assetId = id || this.generateAssetId();
      
      // Always store asset offline first for resilience
      await saveOfflineAsset(
        { 
          id: assetId, 
          type: file.type, 
          size: file.size,
          owner_id: this.userId || 'anonymous',
          createdAt: new Date().toISOString(),
        }, 
        file
      );

      // If we're online, also upload to Supabase
      if (this.isOnline && this.userId) {
        try {
          const { error } = await supabase.storage
            .from('assets')
            .upload(`${this.userId}/${assetId}`, file);

          if (error) {
            console.error('Error uploading to Supabase:', error);
            // Continue with offline version
          }
        } catch (uploadError) {
          console.error('Supabase upload failed:', uploadError);
          // Continue with offline version
        }
      }
      
      return assetId;
    } catch (error) {
      console.error('Error in uploadAsset:', error);
      return null;
    }
  }

  /**
   * Get an asset by ID. Used internally to retrieve assets.
   */
  private async getAsset(assetId: string): Promise<Blob | null> {
    try {
      // First try to get from offline storage
      const offlineAssetData = await getOfflineAssetData(assetId);
      if (offlineAssetData instanceof Blob) {
        return offlineAssetData;
      }
      
      // If online and no offline version, try to get from Supabase
      if (this.isOnline && this.userId) {
        const { data, error } = await supabase.storage
          .from('assets')
          .download(`${this.userId}/${assetId}`);

        if (error) {
          console.error('Error downloading from Supabase:', error);
          return null;
        }

        if (data) {
          // Cache the asset offline for later access
          const offlineAsset = await getOfflineAsset(assetId);
          if (!offlineAsset) {
            await saveOfflineAsset(
              { 
                id: assetId, 
                type: data.type, 
                size: data.size,
                owner_id: this.userId,
                createdAt: new Date().toISOString(),
              }, 
              data
            );
          }
          return data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error in getAsset:', error);
      return null;
    }
  }

  /**
   * Delete an asset from both offline storage and Supabase when online.
   */
  async delete(assetId: string): Promise<boolean> {
    try {
      // Delete from offline storage
      await deleteOfflineAsset(assetId);
      
      // If online, also delete from Supabase
      if (this.isOnline && this.userId) {
        try {
          const { error } = await supabase.storage
            .from('assets')
            .remove([`${this.userId}/${assetId}`]);

          if (error) {
            console.error('Error deleting from Supabase:', error);
          }
        } catch (deleteError) {
          console.error('Supabase delete failed:', deleteError);
        }
      }
      
      // Remove from cache if exists
      if (this.assetCache.has(assetId)) {
        const cachedUrl = this.assetCache.get(assetId);
        if (cachedUrl && cachedUrl.startsWith('blob:')) {
          URL.revokeObjectURL(cachedUrl);
        }
        this.assetCache.delete(assetId);
      }
      
      return true;
    } catch (error) {
      console.error('Error in delete:', error);
      return false;
    }
  }

  /**
   * Required method for TLAssetStore interface.
   * Resolves an asset ID to a URL that can be used in the browser.
   */
  async resolve(asset: TLAsset): Promise<string | undefined> {
    try {
      const assetId = asset.id;
      
      // Check cache first
      if (this.assetCache.has(assetId)) {
        return this.assetCache.get(assetId);
      }
      
      // Try to get from offline storage first
      const offlineAssetData = await getOfflineAssetData(assetId);
      if (offlineAssetData) {
        let url: string;
        
        if (typeof offlineAssetData === 'string') {
          // It's already a URL or data URL
          url = offlineAssetData;
        } else {
          // Convert Blob to Object URL
          url = await this.createBlobUrl(offlineAssetData as Blob, asset.type);
        }
        
        // Cache the URL for future resolves
        this.assetCache.set(assetId, url);
        return url;
      }
      
      // If online, try to get from Supabase
      if (this.isOnline && this.userId) {
        const { data } = supabase.storage
          .from('assets')
          .getPublicUrl(`${this.userId}/${assetId}`);
          
        if (data?.publicUrl) {
          // Cache the URL for future resolves
          this.assetCache.set(assetId, data.publicUrl);
          return data.publicUrl;
        }
      }
      
      // Fallback to any provided src
      if (asset.props.src) {
        // Cache the URL for future resolves
        this.assetCache.set(assetId, asset.props.src);
        return asset.props.src;
      }
      
      // No asset found
      console.warn('Asset not found:', assetId);
      return undefined;
    } catch (error) {
      console.error('Error in resolve:', error);
      return undefined;
    }
  }
  
  /**
   * Helper method to convert a file to a blob for processing.
   */
  async toBlob(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Blob([reader.result], { type: file.type }));
        } else {
          reject(new Error("Failed to convert file to blob"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
  /**
   * Helper method for creating assets from files.
   * Creates a temporary asset and uploads it.
   */
  async createAssetFromFile(file: File): Promise<{ id: string, size: number, type: string, name: string, src: string }> {
    // Create a temporary asset
    const assetId = this.generateAssetId();
    const tempAsset = {
      id: assetId,
      typeName: 'asset',
      type: file.type.includes('image') ? 'image' : 'file',
      props: {}
    } as TLAsset;
    
    // Upload the file and get the result
    const result = await this.upload(tempAsset, file);
    
    return {
      id: assetId,
      size: file.size,
      type: file.type,
      name: file.name,
      src: result.src
    };
  }

  /**
   * Creates a tldraw-compatible asset from a web URL, downloading and storing it.
   */
  async createAssetFromUrl(url: string): Promise<{ id: string, size: number, type: string, name: string, src: string } | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

      const blob = await response.blob();
      const fileType = blob.type || 'image/png';
      const fileName = url.split('/').pop() || 'image';

      const file = new File([blob], fileName, { type: fileType });
      return await this.createAssetFromFile(file);
    } catch (error) {
      console.error('Error creating asset from URL:', error);
      return null;
    }
  }
}

/**
 * Create a TLAssetStore instance for a user
 */
export function createWitepadAssetStore(userId: string | null): TLAssetStore {
  return new WitepadAssetStore(userId);
}
