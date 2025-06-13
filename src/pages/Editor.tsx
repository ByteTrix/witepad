
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TldrawEditor } from '@/components/TldrawEditor'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Editor = () => {
  const { documentId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="h-screen w-full">
      <TldrawEditor documentId={documentId} />
    </div>
  )
}

export default Editor
