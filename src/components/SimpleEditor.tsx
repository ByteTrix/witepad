import { Tldraw, TLComponents, TLUserPreferences, useTldrawUser, useToasts } from 'tldraw'
import { useSyncDemo } from '@tldraw/sync'
import 'tldraw/tldraw.css'
import { useEffect, useCallback, useMemo, useState } from 'react'
import { useDocuments } from '@/hooks/useDocuments'
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

export const SimpleEditor = ({ documentId, isPublicRoom = false }: SimpleEditorProps) => {
  const roomId = documentId || 'default-room'
  const { updateDocument } = useDocuments()
  const { user } = useAuth()
  
  // ...existing code...
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
    }
  }, [user, isPublicRoom])

  // Create sync store with user info
  const sync = useSyncDemo({ roomId, userInfo: userPreferences })

  // Create tldraw user object
  const tldrawUser = useTldrawUser({ userPreferences, setUserPreferences })  // Cloud save function (without toast - toast is handled in the KeyboardShortcuts component)
  const handleCloudSave = useCallback(() => {
    if (isPublicRoom || !user || !documentId || !sync || !sync.store) return
    const store = sync.store
    const allRecords = store.allRecords()
    updateDocument(documentId, {
      data: JSON.stringify(allRecords),
      snapshot: JSON.stringify(allRecords),
    })
  }, [user, documentId, sync, updateDocument, isPublicRoom])  // Configure custom UI zones
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
  }), [documentId, userPreferences, setUserPreferences, handleCloudSave, isPublicRoom, user])

  // Defensive: Only proceed if sync and sync.store are defined
  // Only save to cloud for authenticated users with real documents (not public rooms)
  useEffect(() => {
    if (isPublicRoom || !user || !documentId || !sync || !sync.store) return
    const store = sync.store
    const unsubscribe = store.listen(
      () => {
        const allRecords = store.allRecords()
        updateDocument(documentId, {
          data: JSON.stringify(allRecords),
          snapshot: JSON.stringify(allRecords),
        })      },
      { scope: 'document' }
    )
    return () => unsubscribe()
  }, [sync, updateDocument, documentId, user, isPublicRoom])

  if (!sync || !sync.store) return null

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw 
        store={sync.store} 
        components={components}
        user={tldrawUser}
        inferDarkMode 
      />
    </div>
  )
}
