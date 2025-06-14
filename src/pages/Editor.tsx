import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SimpleEditor } from '@/components/SimpleEditor'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'


const Editor = () => {
  const { documentId } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  // Always require authentication for document access
  const roomId = documentId
  const isPublicRoom = false // Disable public rooms for security

  useEffect(() => {
    // Always require authentication for document editing
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Always require authentication
  if (!user) return null

  return (
    <>
     {/* Always show header for authenticated users */}
      <div className="flex-1">
        <SimpleEditor documentId={roomId} isPublicRoom={isPublicRoom} />
      </div>
    </>
  )
}

export default Editor
