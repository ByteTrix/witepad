
import { TldrawEditor } from '@/components/TldrawEditor'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'

const Index = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="pt-16 h-screen">
        <TldrawEditor 
          documentId="default"
          isAuthenticated={!!user}
        />
      </div>
    </div>
  )
}

export default Index
