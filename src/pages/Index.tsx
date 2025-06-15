
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocuments } from '@/hooks/useDocuments'

const Index = () => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to landing page
    if (!isLoading && !user) {
      window.location.href = 'http://localhost:3000'
      return
    }
    
    // If authenticated, redirect to documents
    if (user) {
      navigate('/documents')
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400/30 border-t-cyan-400 mx-auto"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-purple-400/20 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-lg">Loading Witepad...</p>
        </div>
      </div>
    )
  }

  // This should not render as users are redirected
  return null
}

export default Index
