import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TldrawEditor } from '@/components/TldrawEditor'
import { Header } from '@/components/Header'
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
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="pt-16 h-screen">
        <TldrawEditor documentId={documentId} />
      </div>
    </div>
  )
}

export default Editor
