import { Tldraw, TLComponents, TLUserPreferences, useTldrawUser, useToasts, createTLStore, defaultShapeUtils, defaultBindingUtils } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { useDocuments, Document } from '@/hooks/useDocuments'
import { useAuth } from '@/contexts/AuthContext'
import { TopPanel, SharePanel } from './editor/EditorHeader'

interface SimpleEditorProps {
  documentId?: string
  isPublicRoom?: boolean
}

// Component that handles keyboard shortcuts and uses tldraw's toast system
// This will be integrated into the TopPanel component
const useKeyboardShortcuts = (onCloudSave: () => void, isPublicRoom: boolean, hasUser: boolean) => {
  const { addToast } = useToasts()

  const handleCloudSaveWithToast = useCallback(() => {
    if (isPublicRoom || !hasUser) {
      addToast({
        title: 'Cannot save',
        description: 'Sign in to save your work to the cloud',
        severity: 'info'
      })
      return
    }
    
    try {
      onCloudSave()
      addToast({
        title: 'Saved to cloud',
        description: 'Your drawing has been saved successfully',
        severity: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Save failed',
        description: 'Failed to save your drawing to the cloud',
        severity: 'error'
      })
    }
  }, [onCloudSave, addToast, isPublicRoom, hasUser])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'S' && e.shiftKey) {
        e.preventDefault()
        handleCloudSaveWithToast()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleCloudSaveWithToast])
}

// Enhanced TopPanel that includes keyboard shortcuts
const TopPanelWithShortcuts = ({ onCloudSave, isPublicRoom, hasUser, documentId }: any) => {
  useKeyboardShortcuts(onCloudSave, isPublicRoom, hasUser)
  return <TopPanel documentId={documentId} />
}

// Custom PageMenu component that shows document name
const CustomPageMenu = ({ documentId, currentDocument, renameDocument }: { documentId?: string, currentDocument: Document | null, renameDocument: (id: string, newName: string) => Promise<boolean> }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Memoize document name to avoid unnecessary re-renders
  const documentName = useMemo(() => {
    if (currentDocument && currentDocument.id === documentId) {
      return currentDocument.name
    }
    return documentId ? 'Loading...' : 'Untitled Document'
  }, [documentId, currentDocument?.name]) // Only depend on the actual name property

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    if (!documentId) return
    setTempName(documentName)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setTempName('')
  }
  const handleSaveEdit = async () => {
    if (!documentId || !tempName.trim()) {
      handleCancelEdit()
      return
    }

    if (tempName.trim() === documentName) {
      handleCancelEdit()
      return
    }

    try {
      const success = await renameDocument(documentId, tempName.trim())
      if (success) {
        // Document name will update automatically via memoized value
        setIsEditing(false)
        setTempName('')
      }
    } catch (error) {
      console.error('Error renaming document:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--color-text)',
      pointerEvents: 'all'
    }}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveEdit}
          style={{
            background: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            padding: '4px 8px',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--color-text)',
            outline: 'none',
            minWidth: '120px'
          }}
          placeholder="Document name"
        />
      ) : (
        <>
          <span 
            style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '150px'
            }}
            title={documentName}
          >
            {documentName}
          </span>
          <button
            onClick={handleStartEdit}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-text-3)',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-3)'
            }}
            title="Edit document name"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

export const SimpleEditor = ({ documentId, isPublicRoom = false }: SimpleEditorProps) => {
  const { updateDocument, loadDocument, currentDocument, renameDocument } = useDocuments({ skipInitialFetch: true })
  const { user } = useAuth()
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (documentId) {
      loadDocument(documentId)
    }
  }, [documentId, loadDocument])

  // Create user preferences with custom user data
  const [userPreferences, setUserPreferences] = useState<TLUserPreferences>(() => {
    if (isPublicRoom && !user) {
      // For public rooms without authentication, create anonymous user
      return {
        id: 'anonymous-' + Math.random().toString(36).substr(2, 9),
        name: 'Anonymous',
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        colorScheme: 'system',
      }
    }
    return {
      id: user?.id || 'user-' + Math.random(),
      name: user?.email?.split('@')[0] || 'Anonymous',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      colorScheme: 'system',
    }
  })

  // Update user preferences when auth user changes (only for authenticated users)
  useEffect(() => {
    if (user && !isPublicRoom) {
      setUserPreferences(prev => ({
        ...prev,
        id: user.id,
        name: user.email?.split('@')[0] || 'Anonymous',
      }))
    }  }, [user, isPublicRoom])
  // Create a local TLDraw store instead of using useSyncDemo for better performance
  // This removes unnecessary collaboration overhead since we handle multi-user via Supabase
  const store = useMemo(() => {
    return createTLStore({
      shapeUtils: defaultShapeUtils,
      bindingUtils: defaultBindingUtils,
    })
  }, [])

  // Load document data into store when document is loaded
  useEffect(() => {
    if (currentDocument && currentDocument.data && store) {
      try {
        const records = JSON.parse(currentDocument.data)
        if (Array.isArray(records) && records.length > 0) {
          store.put(records)
        }
      } catch (error) {
        console.error('Error loading document data:', error)
      }
    }
  }, [currentDocument, store])

  // Create tldraw user object
  const tldrawUser = useTldrawUser({ userPreferences, setUserPreferences })  // Cloud save function (without toast - toast is handled in the KeyboardShortcuts component)
  const handleCloudSave = useCallback(() => {
    if (isPublicRoom || !user || !documentId || !store) return
    const allRecords = store.allRecords()
    updateDocument(documentId, {
      data: JSON.stringify(allRecords),
      snapshot: JSON.stringify(allRecords),
    })
  }, [user, documentId, store, updateDocument, isPublicRoom])// Configure custom UI zones
  const components: TLComponents = useMemo(() => ({
    TopPanel: () => (
      <TopPanelWithShortcuts
        onCloudSave={handleCloudSave}
        isPublicRoom={isPublicRoom}
        hasUser={!!user}
        documentId={documentId}
      />
    ),
    SharePanel: () => (
      <SharePanel 
        documentId={documentId} 
        userPreferences={userPreferences}
        setUserPreferences={setUserPreferences}
      />
    ),
    PageMenu: () => (
      <CustomPageMenu documentId={documentId} currentDocument={currentDocument} renameDocument={renameDocument} />
    ),
  }), [documentId, userPreferences, setUserPreferences, handleCloudSave, isPublicRoom, user, currentDocument, renameDocument])  // Defensive: Only proceed if store is defined
  // Only save to cloud for authenticated users with real documents (not public rooms)
  useEffect(() => {
    if (isPublicRoom || !user || !documentId || !store) return
    const unsubscribe = store.listen(
      () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(() => {
          const allRecords = store.allRecords()
          updateDocument(documentId, {
            data: JSON.stringify(allRecords),
            snapshot: JSON.stringify(allRecords),
          })
        }, 1000) // Increased to 1000ms (1 second) debounce to reduce frequent saves
      },
      { scope: 'document', source: 'user' }
    )
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      unsubscribe()
    }
  }, [store, updateDocument, documentId, user, isPublicRoom])
  if (!store) return null

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw 
        store={store} 
        components={components}
        user={tldrawUser}
        inferDarkMode 
      />
    </div>
  )
}
