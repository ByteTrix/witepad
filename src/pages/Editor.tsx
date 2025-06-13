import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SimpleEditor } from '@/components/SimpleEditor'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'

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
    <div className="h-screen w-full bg-background">
      <Header flat />
      <div className="flex-1">
        <SimpleEditor documentId={documentId} />
      </div>
    </div>
  )
}

export default Editor
