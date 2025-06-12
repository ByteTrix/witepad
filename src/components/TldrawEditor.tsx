
import { Tldraw, createTLStore, defaultShapeUtils, defaultTools } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useState } from 'react'

interface TldrawEditorProps {
  documentId?: string
  isAuthenticated: boolean
}

export const TldrawEditor = ({ documentId, isAuthenticated }: TldrawEditorProps) => {
  const [store] = useState(() => {
    return createTLStore({
      shapeUtils: defaultShapeUtils,
    })
  })

  useEffect(() => {
    // Here we'll add Supabase sync integration later
    console.log('Document ID:', documentId)
    console.log('Authenticated:', isAuthenticated)
  }, [documentId, isAuthenticated])

  return (
    <div className="h-full w-full">
      <Tldraw
        store={store}
        tools={defaultTools}
        hideUi={false}
        components={{
          SharePanel: null, // Remove default share panel
          MenuPanel: null, // We'll create custom menu
        }}
      />
    </div>
  )
}
