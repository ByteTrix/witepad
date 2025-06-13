import { Tldraw } from 'tldraw'
import { useSyncDemo } from '@tldraw/sync'
import 'tldraw/tldraw.css'
import { useEffect } from 'react'
import { useDocuments } from '@/hooks/useDocuments'
import { useAuth } from '@/contexts/AuthContext'

interface SimpleEditorProps {
  documentId?: string
}

export const SimpleEditor = ({ documentId }: SimpleEditorProps) => {
  const roomId = documentId || 'default-room'
  const sync = useSyncDemo({ roomId })
  const { updateDocument } = useDocuments()
  const { user } = useAuth()

  // Defensive: Only proceed if sync and sync.store are defined
  useEffect(() => {
    if (!user || !documentId || !sync || !sync.store) return
    const store = sync.store
    const unsubscribe = store.listen(
      () => {
        const allRecords = store.allRecords()
        updateDocument(documentId, {
          data: JSON.stringify(allRecords),
          snapshot: JSON.stringify(allRecords),
        })
      },
      { scope: 'document' }
    )
    return () => unsubscribe()
  }, [sync, updateDocument, documentId, user])

  if (!sync || !sync.store) return null

  return (
    <div className='h-screen w-full flex flex-col bg-background relative overflow-hidden'>
      <Tldraw store={sync.store} />
      
    </div>
  )
}
