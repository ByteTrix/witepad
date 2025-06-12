
import { Tldraw, createTLStore, defaultShapeUtils, defaultTools, TLStore } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useDocuments } from '@/hooks/useDocuments'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'

interface TldrawEditorProps {
  documentId?: string
}

export const TldrawEditor = ({ documentId }: TldrawEditorProps) => {
  const { user } = useAuth()
  const { currentDocument, createDocument, updateDocument, loadDocument } = useDocuments()
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)

  // Create store with default shape utils
  const store = useMemo(() => {
    return createTLStore({
      shapeUtils: defaultShapeUtils,
    })
  }, [])

  // Set up real-time sync
  const { isConnected } = useRealtimeSync(store, currentDocId)

  // Auto-save document data periodically
  useEffect(() => {
    if (!user || !currentDocId || !store) return

    const interval = setInterval(async () => {
      try {
        const snapshot = store.getSnapshot()
        await updateDocument(currentDocId, {
          data: snapshot,
          snapshot: snapshot
        })
        console.log('Auto-saved document:', currentDocId)
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, 10000) // Auto-save every 10 seconds

    return () => clearInterval(interval)
  }, [user, currentDocId, store, updateDocument])

  // Load document data when document changes
  useEffect(() => {
    if (!user) return

    const initializeDocument = async () => {
      if (documentId) {
        // Load specific document
        const doc = await loadDocument(documentId)
        if (doc) {
          setCurrentDocId(doc.id)
          if (doc.data && Object.keys(doc.data).length > 0) {
            store.loadSnapshot(doc.data)
          }
        }
      } else {
        // Create new document
        const doc = await createDocument('Untitled Drawing')
        if (doc) {
          setCurrentDocId(doc.id)
        }
      }
    }

    initializeDocument()
  }, [user, documentId, loadDocument, createDocument, store])

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
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-xs text-muted-foreground">
          {isConnected ? 'Synced' : 'Offline'}
        </span>
        {currentDocument && (
          <span className="text-xs text-muted-foreground border-l pl-2 ml-2">
            {currentDocument.name}
          </span>
        )}
      </div>
      
      <Tldraw
        store={store}
        tools={defaultTools}
        hideUi={false}
        components={components}
        className="tldraw-custom"
      />
      
      <style jsx>{`
        .tldraw-custom .tlui-menu-zone {
          display: none !important;
        }
        .tldraw-custom .tlui-help-menu {
          display: none !important;
        }
        .tldraw-custom .tlui-navigation-zone {
          bottom: 20px !important;
        }
      `}</style>
    </div>
  )
}
