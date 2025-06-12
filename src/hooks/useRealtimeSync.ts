
import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { TLStore, TLRecord } from 'tldraw'

export const useRealtimeSync = (store: TLStore, documentId: string | null) => {
  const { user } = useAuth()
  const lastOperation = useRef<any>(null)
  const isApplyingRemoteChange = useRef(false)

  // Send operation to Supabase
  const sendOperation = useCallback(async (operation: any) => {
    if (!user || !documentId || isApplyingRemoteChange.current) return

    try {
      const { error } = await supabase
        .from('document_operations')
        .insert({
          document_id: documentId,
          user_id: user.id,
          operation: operation
        })

      if (error) {
        console.error('Error sending operation:', error)
      }
    } catch (error) {
      console.error('Error sending operation:', error)
    }
  }, [user, documentId])

  // Apply remote operation to store
  const applyRemoteOperation = useCallback((operation: any) => {
    if (!store || isApplyingRemoteChange.current) return

    try {
      isApplyingRemoteChange.current = true
      
      // Apply the operation based on its type
      if (operation.type === 'put_records') {
        store.put(operation.records)
      } else if (operation.type === 'remove_records') {
        store.remove(operation.recordIds)
      }
    } catch (error) {
      console.error('Error applying remote operation:', error)
    } finally {
      isApplyingRemoteChange.current = false
    }
  }, [store])

  // Listen for store changes and send operations
  useEffect(() => {
    if (!store || !user || !documentId) return

    const handleStoreChange = (changes: any) => {
      if (isApplyingRemoteChange.current) return

      const { added, updated, removed } = changes

      // Send put operations for added/updated records
      if (Object.keys(added).length > 0 || Object.keys(updated).length > 0) {
        const records = [...Object.values(added), ...Object.values(updated)]
        if (records.length > 0) {
          const operation = {
            type: 'put_records',
            records: records,
            timestamp: Date.now()
          }
          sendOperation(operation)
        }
      }

      // Send remove operations for removed records
      if (Object.keys(removed).length > 0) {
        const recordIds = Object.keys(removed)
        if (recordIds.length > 0) {
          const operation = {
            type: 'remove_records',
            recordIds: recordIds,
            timestamp: Date.now()
          }
          sendOperation(operation)
        }
      }
    }

    const unsubscribe = store.listen(handleStoreChange, { scope: 'all' })
    return unsubscribe
  }, [store, user, documentId, sendOperation])

  // Listen for real-time operations from other users
  useEffect(() => {
    if (!user || !documentId) return

    console.log('Setting up realtime sync for document:', documentId)

    const channel = supabase
      .channel(`document-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'document_operations',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          const operation = payload.new
          
          // Don't apply our own operations
          if (operation.user_id === user.id) return

          console.log('Received remote operation:', operation)
          applyRemoteOperation(operation.operation)
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })

    return () => {
      console.log('Cleaning up realtime subscription')
      supabase.removeChannel(channel)
    }
  }, [user, documentId, applyRemoteOperation])

  return {
    isConnected: !!user && !!documentId
  }
}
