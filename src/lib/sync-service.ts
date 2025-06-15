
import { supabase } from '@/integrations/supabase/client'
import { saveDocument as saveOfflineDoc, getAllDocuments, deleteDocument as deleteOfflineDoc } from '@/lib/offline-db'

export class SyncService {
  private isOnline = navigator.onLine
  private syncQueue: Array<{ type: 'create' | 'update' | 'delete', document: any }> = []
  private isSyncing = false

  constructor() {
    this.setupEventListeners()
    this.loadSyncQueue()
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncPendingChanges()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })

    // Sync when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncPendingChanges()
      }
    })
  }

  private loadSyncQueue() {
    try {
      const saved = localStorage.getItem('witepad-sync-queue')
      if (saved) {
        this.syncQueue = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Error loading sync queue:', error)
    }
  }

  private saveSyncQueue() {
    try {
      localStorage.setItem('witepad-sync-queue', JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error('Error saving sync queue:', error)
    }
  }

  addToSyncQueue(type: 'create' | 'update' | 'delete', document: any) {
    this.syncQueue.push({ type, document })
    this.saveSyncQueue()

    if (this.isOnline) {
      this.syncPendingChanges()
    }
  }

  async syncPendingChanges() {
    if (this.isSyncing || !this.isOnline || this.syncQueue.length === 0) {
      return
    }

    this.isSyncing = true
    console.log(`Syncing ${this.syncQueue.length} pending changes...`)

    const failedItems: typeof this.syncQueue = []

    for (const item of this.syncQueue) {
      try {
        switch (item.type) {
          case 'create':
          case 'update':
            await this.syncDocumentToCloud(item.document)
            break
          case 'delete':
            await this.deleteDocumentFromCloud(item.document.id)
            break
        }
      } catch (error) {
        console.error(`Failed to sync ${item.type} for document ${item.document.id}:`, error)
        failedItems.push(item)
      }
    }

    this.syncQueue = failedItems
    this.saveSyncQueue()
    this.isSyncing = false

    if (failedItems.length === 0) {
      console.log('All changes synced successfully')
    } else {
      console.log(`${failedItems.length} items failed to sync`)
    }
  }

  private async syncDocumentToCloud(document: any) {
    const { id, created_at, updated_at, ...docData } = document

    if (id.startsWith('temp-')) {
      // Create new document in cloud
      const { data, error } = await supabase
        .from('documents')
        .insert(docData)
        .select()
        .single()

      if (error) throw error

      // Update local document with cloud ID
      await saveOfflineDoc({ ...document, id: data.id, synced: true })
      
      // Remove temp document
      await deleteOfflineDoc(id)
    } else {
      // Update existing document
      const { error } = await supabase
        .from('documents')
        .update({ ...docData, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      // Mark as synced in local storage
      await saveOfflineDoc({ ...document, synced: true })
    }
  }

  private async deleteDocumentFromCloud(documentId: string) {
    if (!documentId.startsWith('temp-')) {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error
    }
  }

  // Force sync all local documents to cloud
  async forceSyncAll(userId: string) {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline')
    }

    const localDocs = await getAllDocuments(userId)
    const unsyncedDocs = localDocs.filter(doc => !doc.synced)

    for (const doc of unsyncedDocs) {
      this.addToSyncQueue(doc.id.startsWith('temp-') ? 'create' : 'update', doc)
    }

    await this.syncPendingChanges()
  }
}

// Create singleton instance
export const syncService = new SyncService()
