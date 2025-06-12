
import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock authentication check - will be replaced with Supabase
    const checkAuth = async () => {
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock sign in - will be replaced with Supabase
    console.log('Signing in:', email)
    setUser({ id: '1', email })
  }

  const signUp = async (email: string, password: string) => {
    // Mock sign up - will be replaced with Supabase
    console.log('Signing up:', email)
    setUser({ id: '1', email })
  }

  const signOut = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}
