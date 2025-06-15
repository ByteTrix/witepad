import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/components/ui/use-toast'
import {
  saveDocument as saveOfflineDoc,
  getDocument as getOfflineDoc,
  getAllDocuments as getAllOfflineDocs,
  deleteDocument as deleteOfflineDoc,
  saveImage as saveOfflineImage,
  getImage as getOfflineImage,
  deleteImage as deleteOfflineImage,
} from '@/lib/offline-db';

export interface Document {
  id: string
  name: string
  owner_id: string
  is_public: boolean
  data: any
  snapshot: any
  created_at: string
  updated_at: string
  synced?: boolean // true if synced to server
  deleted?: boolean // true if deleted locally
  isRenaming?: boolean // used for UI state management
}

export const useDocuments = (options?: { skipInitialFetch?: boolean }) => {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [localDocuments, setLocalDocuments] = useState<Document[]>([])
  
  // Add refs to prevent multiple simultaneous requests
  const fetchingRef = useRef(false)
  const lastFetchRef = useRef<number>(0)

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      console.log('Back online, syncing documents...');
      // Only fetch if we haven't fetched recently
      if (Date.now() - lastFetchRef.current > 5000) {
        fetchDocuments();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('App is offline. Using local documents.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load local documents from localStorage on init
  useEffect(() => {
    if (user) {
      try {
        const savedDocs = localStorage.getItem(`cloud-sketch-local-docs-${user.id}`);
        if (savedDocs) {
          const parsedDocs = JSON.parse(savedDocs);
          setLocalDocuments(parsedDocs);
          
          // If we're offline, use local documents as the primary source
          if (!navigator.onLine) {
            setDocuments(parsedDocs);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error loading local documents:', error);
      }
    }
  }, [user]);

  // Save local documents to localStorage when they change
  useEffect(() => {
    if (user && localDocuments.length > 0) {
      try {
        localStorage.setItem(
          `cloud-sketch-local-docs-${user.id}`, 
          JSON.stringify(localDocuments)
        );
      } catch (error) {
        console.error('Error saving local documents:', error);
      }
    }
  }, [user, localDocuments]);

  // Memoized fetch function with debouncing
  const fetchDocuments = useCallback(async () => {
    if (!user || fetchingRef.current) return;
    
    // Prevent multiple simultaneous requests
    if (Date.now() - lastFetchRef.current < 1000) {
      console.log('Skipping fetch - too recent');
      return;
    }
    
    fetchingRef.current = true;
    lastFetchRef.current = Date.now();
    
    if (!navigator.onLine) {
      setIsOffline(true);
      setIsLoading(false);
      // Load from IndexedDB
      try {
        const docs = await getAllOfflineDocs(user.id);
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading offline documents:', error);
      }
      fetchingRef.current = false;
      return;
    }

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      
      // Mark server documents as synced
      const syncedData = (data || []).map(doc => ({ ...doc, synced: true }))
      setDocuments(syncedData)
      
      // Update local cache with server data
      setLocalDocuments(syncedData);
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Error",
        description: "Failed to fetch documents, using local data instead",
        variant: "destructive"
      });
      
      // Fall back to local documents if available
      if (localDocuments.length > 0) {
        setDocuments(localDocuments);
      }
    } finally {
      setIsLoading(false)
      fetchingRef.current = false;
    }
  }, [user, localDocuments])

  // Create new document
  const createDocument = async (name: string = 'Untitled') => {
    if (!user) return null;
    const tempId = `temp-${Date.now()}`;
    if (!navigator.onLine || isOffline) {
      const newDoc: Document = {
        id: tempId,
        name,
        owner_id: user.id,
        is_public: false,
        data: {},
        snapshot: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced: false,
      };
      await saveOfflineDoc(newDoc);
      setDocuments(prev => [newDoc, ...prev]);
      setCurrentDocument(newDoc);
      toast({
        title: "Document created locally",
        description: `Created "${name}" in offline mode`
      });
      return newDoc;
    }

    try {
      console.log('Creating document:', name)
      
      // Add timeout to prevent hanging on network issues
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const createPromise = supabase
        .from('documents')
        .insert({
          name,
          owner_id: user.id,
          data: {},
          snapshot: {}
        })
        .select()
        .single()

      const { data, error } = await Promise.race([createPromise, timeoutPromise]) as any

      if (error) {
        console.error('Supabase error creating document:', error)
        throw error
      }

      console.log('Document created successfully:', data)
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
        description: error.message || "Failed to create document",
        variant: "destructive"
      })
      return null
    }
  }

  // Update document
  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    if (!user) return false
    if (!navigator.onLine || isOffline || documentId.startsWith('temp-')) {
      const doc = await getOfflineDoc(documentId);
      if (doc) {
        const updatedDoc = { ...doc, ...updates, updated_at: new Date().toISOString(), synced: false };
        await saveOfflineDoc(updatedDoc);
        setDocuments(prev => prev.map(d => d.id === documentId ? updatedDoc : d));
          if (currentDocument?.id === documentId) {
          const updateKeys = Object.keys(updates);
          const isOnlyContentUpdate = updateKeys.length > 0 && updateKeys.every(k => ['data', 'snapshot'].includes(k));
          
          if (!isOnlyContentUpdate) {
            setCurrentDocument(updatedDoc);
          }
          // For content-only updates, don't trigger currentDocument updates to avoid UI refreshes
        }
        return true;
      }
      return false;
    }

    try {
      const newUpdatedAt = new Date().toISOString();
      const { error } = await supabase
        .from('documents')
        .update({
          ...updates,
          updated_at: newUpdatedAt
        })
        .eq('id', documentId)

      if (error) throw error

      const newDocData = { ...updates, updated_at: newUpdatedAt, synced: true };

      setDocuments(prev =>
        prev.map(doc => doc.id === documentId ? { ...doc, ...newDocData } : doc)      )

      if (currentDocument?.id === documentId) {
        const updateKeys = Object.keys(updates);
        const isOnlyContentUpdate = updateKeys.length > 0 && updateKeys.every(k => ['data', 'snapshot'].includes(k));

        if (!isOnlyContentUpdate) {
          setCurrentDocument(prev => prev ? { ...prev, ...newDocData } : null)
        }
        // For content-only updates, don't trigger currentDocument updates to avoid UI refreshes
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
    if (!navigator.onLine || isOffline || documentId.startsWith('temp-')) {
      await deleteOfflineDoc(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      if (currentDocument?.id === documentId) setCurrentDocument(null);
      toast({
        title: "Document deleted",
        description: "Document deleted locally"
      });
      return true;
    }

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
  const loadDocument = useCallback(async (documentId: string) => {
    if (!user) return null;
    if (!navigator.onLine || isOffline || documentId.startsWith('temp-')) {
      const doc = await getOfflineDoc(documentId);
      if (doc) {
        setCurrentDocument(doc);
        return doc;
      }
      return null;
    }

    try {
      console.log('Loading document:', documentId)
      
      // Add timeout to prevent hanging on network issues
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const loadPromise = supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      const { data, error } = await Promise.race([loadPromise, timeoutPromise]) as any

      if (error) {
        console.error('Supabase error loading document:', error)
        throw error
      }

      console.log('Document loaded successfully:', data)
      setCurrentDocument(data)
      return data
    } catch (error: any) {
      console.error('Error loading document:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to load document",
        variant: "destructive"
      })
      return null
    }
  }, [user, isOffline])

  // Rename document
  const renameDocument = async (id: string, newName: string) => {
    if (!user) return false;

    // Don't allow empty names
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Document name cannot be empty",
        variant: "destructive"
      });
      return false;
    }

    // Find the document to update
    const docToUpdate = documents.find(doc => doc.id === id);
    if (!docToUpdate) {
      console.error('Document not found for renaming:', id);
      return false;
    }

    // Create updated document
    const updatedDoc = {
      ...docToUpdate,
      name: newName.trim(),
      updated_at: new Date().toISOString(),
    };

    if (!navigator.onLine || isOffline) {
      try {
        // Update the document in IndexedDB
        await saveOfflineDoc({
          ...updatedDoc,
          synced: false,
        });

        // Update the document in the state
        setDocuments(prev => prev.map(doc => 
          doc.id === id ? { ...doc, name: newName.trim(), updated_at: new Date().toISOString() } : doc
        ));

        if (currentDocument?.id === id) {
          setCurrentDocument({ ...currentDocument, name: newName.trim() });
        }

        toast({
          title: "Document renamed",
          description: `Renamed to "${newName}" (offline)`
        });

        return true;
      } catch (error) {
        console.error('Error renaming document offline:', error);
        toast({
          title: "Error",
          description: "Failed to rename document",
          variant: "destructive"
        });
        return false;
      }
    }

    try {
      const { error } = await supabase
        .from('documents')
        .update({ name: newName.trim(), updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Update documents state
      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, name: newName.trim(), updated_at: new Date().toISOString(), synced: true } : doc
      ));

      // Update current document if it's the one being renamed
      if (currentDocument?.id === id) {
        setCurrentDocument({ ...currentDocument, name: newName.trim(), synced: true });
      }

      toast({
        title: "Document renamed",
        description: `Renamed to "${newName}"`
      });

      return true;
    } catch (error: any) {
      console.error('Error renaming document:', error);
      
      // Try to save the rename offline
      try {
        await saveOfflineDoc({
          ...updatedDoc,
          synced: false,
        });

        setDocuments(prev => prev.map(doc => 
          doc.id === id ? { ...doc, name: newName.trim(), updated_at: new Date().toISOString(), synced: false } : doc
        ));

        if (currentDocument?.id === id) {
          setCurrentDocument({ ...currentDocument, name: newName.trim(), synced: false });
        }

        toast({
          title: "Document renamed locally",
          description: "Changes will sync when you're back online"
        });

        return true;
      } catch (offlineError) {
        toast({
          title: "Error",
          description: "Failed to rename document",
          variant: "destructive"
        });
        return false;
      }
    }
  }

  // Only fetch documents when user changes and prevent multiple calls
  useEffect(() => {
    if (user && !fetchingRef.current && !options?.skipInitialFetch) {
      fetchDocuments()
    } else if (!user) {
      setDocuments([])
      setCurrentDocument(null)
      setIsLoading(false)
    }
  }, [user, options?.skipInitialFetch, fetchDocuments])

  return {
    documents,
    currentDocument,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
    loadDocument,
    fetchDocuments,
    renameDocument
  }
}
