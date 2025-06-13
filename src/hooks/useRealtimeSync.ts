
import { useEffect, useRef, useCallback, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { TLStore, TLRecord } from 'tldraw'

export const useRealtimeSync = (store: TLStore, documentId: string | null) => {
  const { user } = useAuth()
  const lastOperation = useRef<any>(null)
  const isApplyingRemoteChange = useRef(false)
  // Track connection status
  const [isConnected, setIsConnected] = useState(false)
  // Use ref to keep track of reconnection attempts
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

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
      if (operation.type === 'put_records' && operation.records) {
        // Validate records before applying
        const validRecords = operation.records.filter((record: any) => 
          record && typeof record === 'object' && 'id' in record
        );
        
        if (validRecords.length > 0) {
          store.put(validRecords);
          console.log(`Applied ${validRecords.length} remote records`);
        }
      } else if (operation.type === 'remove_records' && operation.recordIds) {
        // Make sure we have valid record IDs
        const validIds = operation.recordIds.filter((id: any) => id && typeof id === 'string');
        
        if (validIds.length > 0) {
          store.remove(validIds);
          console.log(`Removed ${validIds.length} remote records`);
        }
      }
    } catch (error) {
      console.error('Error applying remote operation:', error)
    } finally {
      // Use a small timeout to prevent rapid consecutive changes
      setTimeout(() => {
        isApplyingRemoteChange.current = false;
      }, 50);
    }
  }, [store])  // Listen for store changes and send operations
  useEffect(() => {
    if (!store || !user || !documentId || documentId.startsWith('temp-')) return

    // Add debounce to avoid sending too many operations
    let changeTimeout: NodeJS.Timeout | null = null;
    let pendingChanges = {
      added: {},
      updated: {},
      removed: {}
    };

    const handleStoreChange = (changes: any) => {
      if (isApplyingRemoteChange.current || !changes) return

      const { added = {}, updated = {}, removed = {} } = changes

      // Accumulate changes
      pendingChanges = {
        added: { ...pendingChanges.added, ...added },
        updated: { ...pendingChanges.updated, ...updated },
        removed: { ...pendingChanges.removed, ...removed }
      };

      // Clear any existing timeout
      if (changeTimeout) {
        clearTimeout(changeTimeout);
      }

      // Set a new timeout to send changes after a short delay
      changeTimeout = setTimeout(() => {
        // Send accumulated changes
        const hasAddedOrUpdated = Object.keys(pendingChanges.added).length > 0 || 
                                  Object.keys(pendingChanges.updated).length > 0;
        
        const hasRemoved = Object.keys(pendingChanges.removed).length > 0;

        // Send put operations for added/updated records
        if (hasAddedOrUpdated) {
          const records = [
            ...Object.values(pendingChanges.added), 
            ...Object.values(pendingChanges.updated)
          ];
          
          if (records.length > 0) {
            const operation = {
              type: 'put_records',
              records: records,
              timestamp: Date.now()
            }
            sendOperation(operation);
          }
        }

        // Send remove operations for removed records
        if (hasRemoved) {
          const recordIds = Object.keys(pendingChanges.removed);
          
          if (recordIds.length > 0) {
            const operation = {
              type: 'remove_records',
              recordIds: recordIds,
              timestamp: Date.now()
            }
            sendOperation(operation);
          }
        }

        // Reset pending changes
        pendingChanges = { added: {}, updated: {}, removed: {} };
      }, 100); // 100ms debounce
    }

    const unsubscribe = store.listen(handleStoreChange, { scope: 'all' })
    
    return () => {
      unsubscribe();
      if (changeTimeout) {
        clearTimeout(changeTimeout);
      }
    }
  }, [store, user, documentId, sendOperation])  // Listen for real-time operations from other users
  useEffect(() => {
    if (!user || !documentId || documentId.startsWith('temp-')) return

    console.log('Setting up realtime sync for document:', documentId)
    
    // Function to create and subscribe to channel
    const setupRealtimeChannel = () => {
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
          
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
            reconnectAttempts.current = 0;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setIsConnected(false);
            console.log('Realtime connection failed, app will work in offline mode')
            
            // Attempt to reconnect if we haven't exceeded max attempts
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current += 1;
              console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
              
              // Try to reconnect after a delay that increases with each attempt
              setTimeout(() => {
                try {
                  supabase.removeChannel(channel);
                  setupRealtimeChannel();
                } catch (error) {
                  console.error('Error during reconnection attempt:', error);
                }
              }, 1000 * reconnectAttempts.current); // Exponential backoff
            }
          }
        });

      return channel;
    };
    
    // Initial channel setup
    const channel = setupRealtimeChannel();

    return () => {
      console.log('Cleaning up realtime subscription')
      try {
        supabase.removeChannel(channel)
      } catch (error) {
        console.error('Error cleaning up realtime subscription:', error)
      }
    }
  }, [user, documentId, applyRemoteOperation])

  return {
    isConnected: !!user && !!documentId && !documentId.startsWith('temp-')
  }
}
