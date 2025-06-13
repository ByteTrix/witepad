
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SimpleEditor } from '@/components/SimpleEditor'
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

  return <SimpleEditor documentId={documentId} />
}

export default Editor
