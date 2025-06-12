
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/components/ui/use-toast'

export interface Document {
  id: string
  name: string
  owner_id: string
  is_public: boolean
  data: any
  snapshot: any
  created_at: string
  updated_at: string
}

export const useDocuments = () => {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user's documents
  const fetchDocuments = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create new document
  const createDocument = async (name: string = 'Untitled') => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          name,
          owner_id: user.id,
          data: {},
          snapshot: {}
        })
        .select()
        .single()

      if (error) throw error

      setDocuments(prev => [data, ...prev])
      setCurrentDocument(data)
      
      toast({
        title: "Document created",
        description: `Created "${name}" successfully`
      })
      
      return data
    } catch (error: any) {
      console.error('Error creating document:', error)
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive"
      })
      return null
    }
  }

  // Update document
  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('documents')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId)

      if (error) throw error

      setDocuments(prev =>
        prev.map(doc => doc.id === documentId ? { ...doc, ...updates } : doc)
      )

      if (currentDocument?.id === documentId) {
        setCurrentDocument(prev => prev ? { ...prev, ...updates } : null)
      }

      return true
    } catch (error: any) {
      console.error('Error updating document:', error)
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive"
      })
      return false
    }
  }

  // Delete document
  const deleteDocument = async (documentId: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error

      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      
      if (currentDocument?.id === documentId) {
        setCurrentDocument(null)
      }

      toast({
        title: "Document deleted",
        description: "Document deleted successfully"
      })

      return true
    } catch (error: any) {
      console.error('Error deleting document:', error)
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      })
      return false
    }
  }

  // Load specific document
  const loadDocument = async (documentId: string) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (error) throw error

      setCurrentDocument(data)
      return data
    } catch (error: any) {
      console.error('Error loading document:', error)
      toast({
        title: "Error",
        description: "Failed to load document",
        variant: "destructive"
      })
      return null
    }
  }

  useEffect(() => {
    if (user) {
      fetchDocuments()
    } else {
      setDocuments([])
      setCurrentDocument(null)
      setIsLoading(false)
    }
  }, [user])

  return {
    documents,
    currentDocument,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    loadDocument,
    fetchDocuments
  }
}
