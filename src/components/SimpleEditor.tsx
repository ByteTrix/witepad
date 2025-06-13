
import { Tldraw, createTLStore, defaultShapeUtils, TLStore } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDocuments } from '@/hooks/useDocuments'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'

interface SimpleEditorProps {
  documentId?: string
}

export const SimpleEditor = ({ documentId }: SimpleEditorProps) => {
  const { user } = useAuth()
  const { currentDocument, createDocument, updateDocument, loadDocument } = useDocuments()
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Create store with default shape utils
  const store = useMemo(() => {
    return createTLStore({
      shapeUtils: defaultShapeUtils,
    })
  }, [])

  // Set up real-time sync
  const { isConnected } = useRealtimeSync(store, currentDocId)
  
  // Save document data
  const saveDocumentData = useCallback(async () => {
    if (!user || !currentDocId || !store || currentDocId.startsWith('temp-') || isSaving) return false
    
    try {
      setIsSaving(true)
      
      const allRecords = store.allRecords()
      const serializedData = JSON.stringify(allRecords)
      
      const success = await updateDocument(currentDocId, {
        data: serializedData,
        snapshot: serializedData
      })
      
      return success
    } catch (error) {
      console.error('Error saving document:', error)
      return false
    } finally {
      setIsSaving(false)
    }
  }, [user, currentDocId, store, updateDocument, isSaving])

  // Load document data
  const loadDocumentData = useCallback(async (docId: string) => {
    if (!user || !store) return
    
    try {
      const doc = await loadDocument(docId)
      
      if (doc && doc.data) {
        let recordsToLoad = []
        
        if (typeof doc.data === 'string') {
          try {
            recordsToLoad = JSON.parse(doc.data)
          } catch (e) {
            console.error('Failed to parse document data:', e)
            return
          }
        } else if (Array.isArray(doc.data)) {
          recordsToLoad = doc.data
        }
        
        if (Array.isArray(recordsToLoad) && recordsToLoad.length > 0) {
          const currentRecords = store.allRecords()
          if (currentRecords.length > 0) {
            store.remove(currentRecords.map(r => r.id))
          }
          store.put(recordsToLoad)
        }
      }
    } catch (error) {
      console.error('Error loading document data:', error)
    }
  }, [user, store, loadDocument])

  // Auto-save functionality
  useEffect(() => {
    if (!user || !currentDocId || !store || currentDocId.startsWith('temp-')) return
    
    let saveTimeout: NodeJS.Timeout
    
    const handleStoreChange = () => {
      clearTimeout(saveTimeout)
      saveTimeout = setTimeout(saveDocumentData, 2000)
    }
    
    const unsubscribe = store.listen(handleStoreChange)
    return () => {
      unsubscribe()
      clearTimeout(saveTimeout)
    }
  }, [user, currentDocId, store, saveDocumentData])

  // Initialize document
  useEffect(() => {
    if (!user || isInitialized) return

    const initializeDocument = async () => {
      try {
        setIsInitialized(true)
        
        if (documentId) {
          setCurrentDocId(documentId)
          await loadDocumentData(documentId)
        } else {
          const doc = await createDocument('Untitled Drawing')
          if (doc) {
            setCurrentDocId(doc.id)
          } else {
            const tempId = `temp-${Date.now()}`
            setCurrentDocId(tempId)
          }
        }
      } catch (error) {
        console.error('Error initializing document:', error)
        const tempId = `temp-${Date.now()}`
        setCurrentDocId(tempId)
        setIsInitialized(true)
      }
    }

    initializeDocument()
  }, [user, documentId, loadDocumentData, createDocument, isInitialized])

  if (!user) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">✏️</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Welcome to Witepad</h2>
            <p className="text-muted-foreground">Please sign in to start drawing</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative">
      {/* Status indicator */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 border border-border/40 shadow-sm">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs text-muted-foreground">
          {isSaving ? 'Saving...' : isConnected ? 'Synced' : 'Offline'}
        </span>
        {currentDocument && (
          <>
            <div className="w-px h-3 bg-border/40"></div>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {currentDocument.name}
            </span>
          </>
        )}
      </div>

      {/* Simple TLDraw Editor */}
      <Tldraw store={store} />
    </div>
  )
}
