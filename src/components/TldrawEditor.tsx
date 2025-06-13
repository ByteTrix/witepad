import { Tldraw, createTLStore, defaultShapeUtils, TLStore } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDocuments } from '@/hooks/useDocuments'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'

// Performance optimization settings
const PERFORMANCE_OPTIONS = {
  hideUi: false,
  hideAvatars: false,
  hideEditor: false,
  hideSnapshots: false,
  hideMenu: true,
  // Additional performance options
  drawingScale: 1, // Default is 1, lower values may improve performance
  throttleUpdates: true,
  enableTimeouts: true, // Enables internal timeouts for better performance
}

interface TldrawEditorProps {
  documentId?: string
}

export const TldrawEditor = ({ documentId }: TldrawEditorProps) => {
  const { user } = useAuth()
  const { currentDocument, createDocument, updateDocument, loadDocument } = useDocuments()
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const saveInProgress = useRef(false)
  const maxRetries = 3

  // Create store with default shape utils
  const store = useMemo(() => {
    return createTLStore({
      shapeUtils: defaultShapeUtils,
    })
  }, [])

  // Set up real-time sync
  const { isConnected } = useRealtimeSync(store, currentDocId)
  
  // Track changes since last save
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const hasChangesRef = useRef(false)
  
  useEffect(() => {
    // Skip for temp documents and when user is not logged in
    if (!user || !currentDocId || !store || currentDocId.startsWith('temp-')) return
    
    const handleStoreChange = () => {
      if (!hasChangesRef.current) {
        hasChangesRef.current = true
        setHasUnsavedChanges(true)
      }
    }
    
    const unsubscribe = store.listen(handleStoreChange)
    return unsubscribe
  }, [user, currentDocId, store])

  // Auto-save document data periodically with performance optimizations
  useEffect(() => {
    if (!user || !currentDocId || !store) return
    
    // Don't auto-save for temporary/offline documents
    if (currentDocId.startsWith('temp-')) return
    
    // Only save when there are changes to save
    if (!hasUnsavedChanges && hasChangesRef.current === false) return
    
    // Avoid saving too frequently
    const saveInterval = 10000 // 10 seconds between saves
    
    const interval = setInterval(async () => {
      // Skip if already saving
      if (saveInProgress.current) return
      
      // Skip if no changes to save
      if (!hasChangesRef.current) return
      
      try {
        saveInProgress.current = true
        // Store the current state for saving
        const storeRecords = store.allRecords()
        const storeData = JSON.stringify(storeRecords)
        
        const success = await updateDocument(currentDocId, {
          data: storeData,
          snapshot: storeData
        })
        
        if (success) {
          console.log('Auto-saved document:', currentDocId)
          setLastSaveTime(new Date())
          setHasUnsavedChanges(false)
          hasChangesRef.current = false
        }
      } catch (error) {
        console.error('Auto-save failed:', error)
      } finally {
        saveInProgress.current = false
      }
    }, saveInterval)

    return () => clearInterval(interval)
  }, [user, currentDocId, store, updateDocument, hasUnsavedChanges])

  // Reset initialization when user changes
  useEffect(() => {
    setIsInitialized(false)
    setCurrentDocId(null)
    setRetryCount(0)
  }, [user])
  // Load document data when document changes
  useEffect(() => {
    if (!user || isInitialized) return

    const initializeDocument = async () => {
      try {
        setIsInitialized(true)
        
        if (documentId) {
          // Load specific document
          console.log('Loading document:', documentId)
          const doc = await loadDocument(documentId)
          if (doc) {            setCurrentDocId(doc.id)
            if (doc.data && typeof doc.data === 'object' && doc.data !== null) {
              try {
                // Parse the stored JSON string if needed
                const recordsData = typeof doc.data === 'string' ? JSON.parse(doc.data) : doc.data;
                
                // Load the data into the store
                if (recordsData && typeof recordsData === 'object') {
                  // Loop through records and put them in the store
                  Object.values(recordsData).forEach((record: any) => {
                    if (record && typeof record === 'object' && 'id' in record) {
                      store.put([record]);
                    }
                  });
                  console.log('Successfully loaded document data');
                }
              } catch (error) {
                console.error('Failed to load document data:', error)
              }
            }
          } else {
            console.error('Document not found:', documentId)
          }
        } else {
          // Only create new document if we don't have a current document
          if (!currentDocId) {
            console.log('Creating new document')
            const doc = await createDocument('Untitled Drawing')
            if (doc) {
              setCurrentDocId(doc.id)
            } else {
              // If document creation fails, try again up to maxRetries times
              if (retryCount < maxRetries) {
                console.log(`Document creation failed, retrying... (${retryCount + 1}/${maxRetries})`)
                setRetryCount(prev => prev + 1)
                setIsInitialized(false) // Allow retry
                return
              }
              
              // If all retries failed, generate a temporary local ID
              console.log('Document creation failed after retries, using temporary local session')
              const tempId = `temp-${Date.now()}`
              setCurrentDocId(tempId)
            }
          }
        }
      } catch (error) {
        console.error('Error initializing document:', error)
        if (retryCount < maxRetries) {
          console.log(`Initialization failed, retrying... (${retryCount + 1}/${maxRetries})`)
          setRetryCount(prev => prev + 1)
          setIsInitialized(false) // Allow retry
        } else {
          console.log('Initialization failed after retries, using temporary local session')
          const tempId = `temp-${Date.now()}`
          setCurrentDocId(tempId)
          setIsInitialized(true)
        }
      }
    }

    initializeDocument()
  }, [user, documentId, loadDocument, createDocument, store, isInitialized, currentDocId, retryCount])

  // Custom UI components to remove tldraw branding
  const components = useMemo(() => ({
    SharePanel: null,
    MenuPanel: null,
    StylePanel: null,
    Minimap: null,
    DebugPanel: null,
  }), [])

  if (!user) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">✏️</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Welcome to DrawBoard</h2>
            <p className="text-muted-foreground">Please sign in to start drawing</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border">
        <div className={`w-2 h-2 rounded-full ${
          currentDocId?.startsWith('temp-') 
            ? 'bg-yellow-500' 
            : (isConnected ? 'bg-green-500' : 'bg-red-500')
        }`}></div>
        <span className="text-xs text-muted-foreground">
          {currentDocId?.startsWith('temp-') 
            ? 'Offline Mode' 
            : (isConnected ? 'Synced' : 'Offline')
          }
        </span>
        {hasUnsavedChanges && !currentDocId?.startsWith('temp-') && (
          <span className="text-xs text-yellow-500 animate-pulse">
            •
          </span>
        )}
        {lastSaveTime && !currentDocId?.startsWith('temp-') && (
          <span className="text-xs text-muted-foreground ml-1">
            Saved {lastSaveTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        )}
        {currentDocument && !currentDocId?.startsWith('temp-') && (
          <span className="text-xs text-muted-foreground border-l pl-2 ml-2">
            {currentDocument.name}
          </span>
        )}
        {currentDocId?.startsWith('temp-') && (
          <span className="text-xs text-muted-foreground border-l pl-2 ml-2">
            Temporary Session
          </span>
        )}
      </div>
      
      <Tldraw
        store={store}
        className="tldraw-custom"
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .tldraw-custom .tlui-menu-zone {
            display: none !important;
          }
          .tldraw-custom .tlui-help-menu {
            display: none !important;
          }
          .tldraw-custom .tlui-navigation-zone {
            bottom: 20px !important;
          }
          /* Performance optimizations */
          .tldraw-custom canvas {
            image-rendering: optimizeSpeed;
          }
          /* Reduce animation complexity */
          .tldraw-custom * {
            transition-duration: 0ms !important;
          }
        `
      }} />
    </div>
  )
}
