import { Tldraw, createTLStore, defaultShapeUtils, TLStore, TLUiOverrides } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDocuments } from '@/hooks/useDocuments'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'
import { EditorHeader } from './editor/EditorHeader'
import { StatusIndicator } from './editor/StatusIndicator'

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
  const [isSaving, setIsSaving] = useState(false)
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
  
  // Save document data with proper serialization
  const saveDocumentData = useCallback(async () => {
    if (!user || !currentDocId || !store || currentDocId.startsWith('temp-') || saveInProgress.current) return false
    
    try {
      setIsSaving(true)
      saveInProgress.current = true
      
      // Get all records from the store
      const allRecords = store.allRecords()
      console.log('Saving document with records:', allRecords.length)
      
      // Serialize the data properly
      const serializedData = JSON.stringify(allRecords)
      
      const success = await updateDocument(currentDocId, {
        data: serializedData,
        snapshot: serializedData
      })
      
      if (success) {
        console.log('Document saved successfully:', currentDocId)
        setLastSaveTime(new Date())
        setHasUnsavedChanges(false)
        hasChangesRef.current = false
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving document:', error)
      return false
    } finally {
      setIsSaving(false)
      saveInProgress.current = false
    }
  }, [user, currentDocId, store, updateDocument])

  // Load document data with proper deserialization
  const loadDocumentData = useCallback(async (docId: string) => {
    if (!user || !store) return
    
    try {
      console.log('Loading document:', docId)
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
          console.log('Loading records into store:', recordsToLoad.length)
          // Clear the store first
          const currentRecords = store.allRecords()
          if (currentRecords.length > 0) {
            store.remove(currentRecords.map(r => r.id))
          }
          // Load new records
          store.put(recordsToLoad)
          console.log('Successfully loaded document data')
        }
      }
    } catch (error) {
      console.error('Error loading document data:', error)
    }
  }, [user, store, loadDocument])

  useEffect(() => {
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

  // Auto-save with debouncing
  useEffect(() => {
    if (!hasUnsavedChanges || !hasChangesRef.current) return
    
    const saveTimeout = setTimeout(async () => {
      await saveDocumentData()
    }, 2000) // Save after 2 seconds of inactivity
    
    return () => clearTimeout(saveTimeout)
  }, [hasUnsavedChanges, saveDocumentData])

  // Initialize document
  useEffect(() => {
    if (!user || isInitialized) return

    const initializeDocument = async () => {
      try {
        setIsInitialized(true)
        
        if (documentId) {
          console.log('Loading document:', documentId)
          setCurrentDocId(documentId)
          await loadDocumentData(documentId)
        } else {
          console.log('Creating new document')
          const doc = await createDocument('Untitled Drawing')
          if (doc) {
            setCurrentDocId(doc.id)
          } else {
            if (retryCount < maxRetries) {
              setRetryCount(prev => prev + 1)
              setIsInitialized(false)
              return
            }
            const tempId = `temp-${Date.now()}`
            setCurrentDocId(tempId)
          }
        }
      } catch (error) {
        console.error('Error initializing document:', error)
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1)
          setIsInitialized(false)
        } else {
          const tempId = `temp-${Date.now()}`
          setCurrentDocId(tempId)
          setIsInitialized(true)
        }
      }
    }

    initializeDocument()
  }, [user, documentId, loadDocumentData, createDocument, isInitialized, retryCount])

  // Custom UI overrides to hide default UI elements
  const uiOverrides: TLUiOverrides = useMemo(() => ({
    actions(editor, actions) {
      // Keep all default actions but customize them
      return actions
    },
    tools(editor, tools) {
      // Keep all default tools
      return tools
    },
    // Hide the default menu and help menu
    components: {
      SharePanel: null,
      MenuPanel: null,
      StylePanel: null,
      DebugPanel: null,
      Minimap: null,
    }
  }), [])

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
    <div className="h-screen w-full flex flex-col bg-background relative overflow-hidden">
      {/* Custom Header */}
      <EditorHeader 
        currentDocument={currentDocument}
        onSave={saveDocumentData}
        isSaving={isSaving}
      />
      
      {/* Status Indicator */}
      <StatusIndicator 
        isConnected={isConnected}
        isOffline={currentDocId?.startsWith('temp-')}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaveTime={lastSaveTime}
        currentDocument={currentDocument}
        isSaving={isSaving}
      />
      
      {/* Tldraw Editor */}
      <div className="flex-1 relative">
        <Tldraw
          store={store}
          overrides={uiOverrides}
          className="tldraw-modern"
        />
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .tldraw-modern {
            --color-background: hsl(var(--background));
            --color-muted: hsl(var(--muted));
            --color-accent: hsl(var(--accent));
            --color-primary: hsl(var(--primary));
            font-family: inherit;
          }
          
          .tldraw-modern .tlui-layout__top {
            display: none !important;
          }
          
          .tldraw-modern .tlui-help-menu {
            display: none !important;
          }
          
          .tldraw-modern .tlui-navigation-zone {
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 12px !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
            padding: 8px !important;
          }
          
          .tldraw-modern .tlui-toolbar {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 12px !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
            padding: 8px !important;
          }
          
          .tldraw-modern .tlui-toolbar__inner {
            gap: 4px !important;
          }
          
          .tldraw-modern .tlui-button {
            border-radius: 8px !important;
            transition: all 0.2s ease !important;
          }
          
          .tldraw-modern .tlui-button:hover {
            transform: scale(1.05) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
          
          .tldraw-modern .tlui-style-panel {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 12px !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
          }
          
          .dark .tldraw-modern .tlui-navigation-zone,
          .dark .tldraw-modern .tlui-toolbar,
          .dark .tldraw-modern .tlui-style-panel {
            background: rgba(20, 20, 20, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
        `
      }} />
    </div>
  )
}
