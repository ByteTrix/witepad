import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/components/ui/use-toast'
import {
  saveDocument as saveOfflineDoc,
  getDocument as getOfflineDoc,
  getAllDocuments as getAllOfflineDocs,
  deleteDocument as deleteOfflineDoc,
  saveAsset, // Added
  getAssetData, // Added
} from '@/lib/offline-db';

export interface Document {
  id: string
  name: string
  owner_id: string
  is_public: boolean
  data: any // Typically a JSON string of tldraw records
  snapshot: any
  created_at: string
  updated_at: string
  synced?: boolean
  deleted?: boolean
  isRenaming?: boolean
}

// Define a simplified TLAsset type for processing
interface TLAsset {
  id: string;
  typeName: 'asset'; // Or check record.type for 'image', 'video' etc.
  type: 'image' | 'video' | 'bookmark' | string; // Actual asset type
  props: {
    src?: string;
    [key: string]: any; // Other properties
  };
}

// Define WitepadAsset if not properly imported/available for type checking
// This should match the one in offline-db.ts
interface WitepadAssetForHook {
  id: string;
  type: string;
  size: number;
  metadata?: any;
  createdAt: string;
  owner_id: string;
}


// Helper function to process document assets (images, etc.)
async function processDocumentAssets(
  documentDataString: string | object | undefined,
  owner_id: string,
  isOnline: boolean
): Promise<string | undefined> {
  if (!documentDataString) return undefined;

  let records: any[];
  try {
    if (typeof documentDataString === 'string') {
      records = JSON.parse(documentDataString);
    } else if (typeof documentDataString === 'object' && documentDataString !== null) {
      if (Array.isArray(documentDataString)) {
        records = documentDataString;
      } else if (Object.keys(documentDataString).length === 0) {
        return JSON.stringify(documentDataString); 
      } else {
        console.warn('Document data is a non-array object, asset processing might be incomplete.');
        records = [documentDataString]; 
      }
    } else {
      return undefined; 
    }

    if (!Array.isArray(records)) {
      if (typeof records === 'object' && Object.keys(records).length === 0) {
        return JSON.stringify(records); 
      }
      console.warn('Document data is not an array of records after parsing, skipping asset processing. Data:', records);
      return JSON.stringify(records); 
    }
  } catch (parseError) {
    console.error('Error parsing document data for asset processing:', parseError, 'Data:', documentDataString);
    return typeof documentDataString === 'string' ? documentDataString : JSON.stringify(documentDataString);
  }

  const FETCHABLE_ASSET_TYPES = ['image', 'video']; // Define media types to fetch

  const processedRecords = await Promise.all(
    records.map(async (record: any) => {
      // Check if it's a tldraw asset record and of a fetchable type
      if (
        record.typeName === 'asset' && 
        typeof record.type === 'string' && // Ensure record.type is a string
        FETCHABLE_ASSET_TYPES.includes(record.type) &&
        record.props &&
        typeof record.props.src === 'string' &&
        (record.props.src.startsWith('http://') || record.props.src.startsWith('https://')) &&
        isOnline 
      ) {
        const tlAsset = record as TLAsset; // Cast to our defined TLAsset type
        try {
          const existingAssetBlob = await getAssetData(tlAsset.id);
          if (existingAssetBlob instanceof Blob && existingAssetBlob.size > 0) {
            if (tlAsset.props.src !== `local-asset:${tlAsset.id}`) {
                console.log(`Asset ${tlAsset.id} (type: ${tlAsset.type}) already in DB, updating src pointer.`);
                return { ...tlAsset, props: { ...tlAsset.props, src: `local-asset:${tlAsset.id}` } };
            }
            return tlAsset; 
          }

          console.log(`Fetching external asset: ${tlAsset.props.src} (type: ${tlAsset.type}, id: ${tlAsset.id})`);
          const response = await fetch(tlAsset.props.src);
          if (!response.ok) {
            console.warn(`Failed to fetch asset ${tlAsset.id} (type: ${tlAsset.type}) from ${tlAsset.props.src}: ${response.statusText}`);
            return tlAsset; 
          }
          const blob = await response.blob();

          const witepadAsset: WitepadAssetForHook = {
            id: tlAsset.id,
            type: tlAsset.type, // Store the specific asset type (e.g., 'image', 'video')
            size: blob.size,
            metadata: { ...tlAsset.props, src: undefined, originalSrc: tlAsset.props.src },
            createdAt: new Date().toISOString(),
            owner_id: owner_id,
          };
          
          await saveAsset(witepadAsset, blob);
          console.log(`Asset ${tlAsset.id} (type: ${tlAsset.type}) fetched and stored in IndexedDB.`);
          return { ...tlAsset, props: { ...tlAsset.props, src: `local-asset:${tlAsset.id}` } };
        } catch (fetchError) {
          console.error(`Error fetching or storing asset ${tlAsset.id} (type: ${tlAsset.type}) from ${tlAsset.props.src}:`, fetchError);
          return tlAsset; 
        }
      }
      return record;
    })
  );
  return JSON.stringify(processedRecords);
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
    const handleOnline = async () => {
      setIsOffline(false);
      console.log('Back online, syncing documents...');
      // Only fetch if we haven't fetched recently
      if (Date.now() - lastFetchRef.current > 5000) {
        fetchDocuments();
      }
      // --- Begin: Sync unsynced local documents to Supabase ---
      if (user) {
        try {
          const localDocs = await getAllOfflineDocs(user.id);
          const unsyncedDocs = localDocs.filter(doc => doc.synced === false);
          for (const doc of unsyncedDocs) {
            // If the doc has a temp- id, it was created offline and needs to be inserted
            if (doc.id.startsWith('temp-')) {
              // Insert as new document
              const { data: created, error } = await supabase
                .from('documents')
                .insert({
                  name: doc.name,
                  owner_id: doc.owner_id,
                  is_public: doc.is_public,
                  data: doc.data,
                  snapshot: doc.snapshot,
                  created_at: doc.created_at,
                  updated_at: doc.updated_at,
                })
                .select()
                .single();
              if (!error && created) {
                // Replace temp doc with real doc in IndexedDB
                await deleteOfflineDoc(doc.id);
                await saveOfflineDoc({ ...doc, ...created, synced: true });
                console.log(`Offline-created document '${doc.name}' synced to Supabase.`);
              } else {
                console.error('Failed to sync offline-created doc to Supabase:', error);
              }
            } else {
              // Update existing document in Supabase
              const { error } = await supabase
                .from('documents')
                .update({
                  name: doc.name,
                  is_public: doc.is_public,
                  data: doc.data,
                  snapshot: doc.snapshot,
                  updated_at: doc.updated_at,
                })
                .eq('id', doc.id);
              if (!error) {
                await saveOfflineDoc({ ...doc, synced: true });
                console.log(`Offline-updated document '${doc.name}' synced to Supabase.`);
              } else {
                console.error('Failed to sync offline-updated doc to Supabase:', error);
              }
            }
          }
        } catch (syncError) {
          console.error('Error syncing offline changes to Supabase:', syncError);
        }
      }
      // --- End: Sync unsynced local documents to Supabase ---
      // Refresh local state from IndexedDB so UI reflects new sync status
      try {
        if (user) {
          const docs = await getAllOfflineDocs(user.id);
          setDocuments(docs);
          setLocalDocuments(docs);
        }
      } catch (refreshError) {
        console.error('Error refreshing documents after sync:', refreshError);
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
    if (Date.now() - lastFetchRef.current < 1000) {
      return;
    }
    
    fetchingRef.current = true;
    lastFetchRef.current = Date.now();
    setIsLoading(true); 
    
    if (!navigator.onLine) {
      setIsOffline(true);
      try {
        console.log('Fetching documents from IndexedDB (offline)');
        const docs = await getAllOfflineDocs(user.id);
        setDocuments(docs);
        setLocalDocuments(docs); 
      } catch (error) {
        console.error('Error loading offline documents:', error);
        toast({
          title: "Offline Error",
          description: "Could not load documents from local storage.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
      }
      return;
    }

    // Online: Fetch from Supabase and update IndexedDB
    try {
      console.log('Fetching documents from Supabase (online)');
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const fetchedDocsData = (data || []).map(doc => ({ ...doc, synced: true }));

      const processedDocs = await Promise.all(fetchedDocsData.map(async (doc) => {
        let dataForProcessing: string | object | undefined = undefined;
        if (typeof doc.data === 'string') {
          dataForProcessing = doc.data;
        } else if (typeof doc.data === 'object' && doc.data !== null) {
          dataForProcessing = doc.data; 
        } else if (doc.data === null || doc.data === undefined) {
          dataForProcessing = JSON.stringify({}); // Default to empty object string if null/undefined
        } else {
          console.warn(`Unexpected data type for doc ${doc.id}: ${typeof doc.data}. Stringifying.`);
          dataForProcessing = JSON.stringify(doc.data);
        }
        const processedDataString = await processDocumentAssets(dataForProcessing, user.id, navigator.onLine);
        return { ...doc, data: processedDataString };
      }));
      
      setDocuments(processedDocs);
      setLocalDocuments(processedDocs); 

      if (user) {
        for (const doc of processedDocs) {
          await saveOfflineDoc(doc);
        }
        console.log('Synced Supabase documents (with processed assets) to IndexedDB');
      }
      
    } catch (error: any) {
      console.error('Error fetching documents from Supabase:', error);
      toast({
        title: "Network Error",
        description: "Failed to fetch documents from server. Trying local storage.",
        variant: "destructive"
      });
      try {
        console.log('Falling back to IndexedDB after Supabase fetch error');
        const docs = await getAllOfflineDocs(user.id);
        setDocuments(docs);
        setLocalDocuments(docs);
      } catch (dbError) {
        console.error('Error loading offline documents after Supabase fail:', dbError);
      }
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [user, supabase, toast, getAllOfflineDocs, saveOfflineDoc]); 

  // Create new document
  const createDocument = async (name: string = 'Untitled') => {
    if (!user) return null;
    const tempId = `temp-${Date.now()}`;
    // Initial document data is typically empty or minimal, no assets to process yet.
    // Assets are added via editor interaction, which triggers updateDocument.
    const initialDocData = JSON.stringify({}); // tldraw expects an object for initial store, often empty.
                                            // Or an array of records. Let's use empty object for new.
                                            // The editor will populate it.

    const newDocBase = {
      name,
      owner_id: user.id,
      is_public: false,
      data: initialDocData, // No assets to process here initially
      snapshot: initialDocData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!navigator.onLine || isOffline) {
      const newDoc: Document = {
        id: tempId,
        ...newDocBase,
        synced: false,
      };
      await saveOfflineDoc(newDoc);
      setDocuments(prev => [newDoc, ...prev].sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      setCurrentDocument(newDoc);
      toast({
        title: "Document created locally",
        description: `Created "${name}" in offline mode`
      });
      return newDoc;
    }

    try {
      console.log('Creating document on Supabase:', name);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      // Supabase expects owner_id, name, data, snapshot for insert
      const { owner_id, data, snapshot } = newDocBase;
      const createPromise = supabase
        .from('documents')
        .insert({ name, owner_id, data, snapshot })
        .select()
        .single();

      const { data: dbDoc, error } = await Promise.race([createPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Supabase error creating document:', error);
        throw error;
      }

      // dbDoc from Supabase will have the final id and other fields. Merge with our base.
      const finalDoc = { ...newDocBase, ...dbDoc, data: initialDocData, snapshot: initialDocData, synced: true };
      console.log('Document created successfully on Supabase:', finalDoc);
      await saveOfflineDoc(finalDoc); 
      setDocuments(prev => [finalDoc, ...prev].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      setCurrentDocument(finalDoc);
      
      toast({
        title: "Document created",
        description: `Created "${name}" successfully`
      });
      
      return finalDoc;
    } catch (error: any) {
      console.error('Error creating document, saving locally:', error);
      const newDoc: Document = {
        id: tempId, 
        ...newDocBase,
        synced: false,
      };
      await saveOfflineDoc(newDoc);
      setDocuments(prev => [newDoc, ...prev].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      setCurrentDocument(newDoc);
      toast({
        title: "Error Creating Online",
        description: `Document "${name}" created locally. Will sync when online. Error: ${error.message}`,
        variant: "default" 
      });
      return newDoc; 
    }
  }

  // Update document
  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    if (!user) return false;
    
    const localDoc = await getOfflineDoc(documentId);
    const docInMemory = documents.find(d => d.id === documentId);
    const docToUpdate = localDoc || docInMemory;


    if (!docToUpdate) {
      console.error("Document not found for update:", documentId);
      toast({ title: "Error", description: "Document not found for update.", variant: "destructive" });
      return false;
    }

    let processedData = updates.data;
    // Ensure updates.data is a string before processing, as SimpleEditor sends stringified records
    if (updates.data && typeof updates.data === 'string') {
        processedData = await processDocumentAssets(updates.data, user.id, navigator.onLine);
    } else if (updates.data && typeof updates.data === 'object') {
        // If it's an object (already parsed), stringify then process, or process directly if helper supports it
        processedData = await processDocumentAssets(JSON.stringify(updates.data), user.id, navigator.onLine);
    }


    const updatedDocData = { 
      ...docToUpdate, 
      ...updates, 
      data: processedData || docToUpdate.data, // Use processed data, fallback to existing if processing yields undefined
      updated_at: new Date().toISOString(),
      owner_id: docToUpdate.owner_id, // Ensure these are preserved
      created_at: docToUpdate.created_at,
    };

    if (!navigator.onLine || isOffline || documentId.startsWith('temp-')) {
      const offlineUpdatedDoc = { ...updatedDocData, synced: false };
      await saveOfflineDoc(offlineUpdatedDoc);
      setDocuments(prev => prev.map(d => d.id === documentId ? offlineUpdatedDoc : d).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      if (currentDocument?.id === documentId) {
        setCurrentDocument(offlineUpdatedDoc);
      }
      console.log('Document updated locally:', documentId);
      return true;
    }

    try {
      // Only send fields that Supabase can update.
      // 'data' should be the processedData string.
      const supabaseUpdatePayload: Partial<Document> = { ...updates };
      if (processedData !== undefined) { // only include data if it was processed
        supabaseUpdatePayload.data = processedData;
      } else {
        delete supabaseUpdatePayload.data; // Don't send undefined data
      }
      // Ensure updated_at is part of the payload for Supabase
      supabaseUpdatePayload.updated_at = updatedDocData.updated_at;


      const { error } = await supabase
        .from('documents')
        .update(supabaseUpdatePayload) 
        .eq('id', documentId);

      if (error) throw error;

      const syncedDoc = { ...updatedDocData, data: processedData || updatedDocData.data, synced: true };
      await saveOfflineDoc(syncedDoc); 

      setDocuments(prev =>
        prev.map(doc => doc.id === documentId ? syncedDoc : doc).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      );

      if (currentDocument?.id === documentId) {
         setCurrentDocument(syncedDoc);
      }
      console.log('Document updated on Supabase and IndexedDB:', documentId);
      return true;
    } catch (error: any) {
      console.error('Error updating document on Supabase, saving locally:', error);
      const fallbackDoc = { ...updatedDocData, data: processedData || updatedDocData.data, synced: false };
      await saveOfflineDoc(fallbackDoc);
      setDocuments(prev => prev.map(d => d.id === documentId ? fallbackDoc : d).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      if (currentDocument?.id === documentId) {
        setCurrentDocument(fallbackDoc);
      }
      toast({
        title: "Update Error",
        description: "Failed to update document on server. Changes saved locally.",
        variant: "default"
      });
      return true; 
    }
  }

  // Delete document
  const deleteDocument = async (documentId: string) => {
    if (!user) return false;
    
    // Delete from IndexedDB first
    try {
      await deleteOfflineDoc(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      if (currentDocument?.id === documentId) setCurrentDocument(null);
      console.log('Document deleted from IndexedDB:', documentId);
    } catch (e) {
      console.error("Error deleting from local DB", e);
      // Continue to try deleting from server if local delete fails for some reason
    }

    if (!navigator.onLine || isOffline || documentId.startsWith('temp-')) {
      // If it was a temp- ID or offline, local deletion is enough
      toast({
        title: "Document deleted locally",
        description: "Document removed from local storage."
      });
      return true;
    }

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        // If server delete fails, it means the doc might still exist on server.
        // We've already deleted locally. User might need to manually resolve or retry.
        // For now, we'll assume local delete is the source of truth for the UI.
        console.error('Supabase error deleting document, but it was deleted locally:', error);
        toast({
          title: "Server Delete Error",
          description: "Failed to delete document from server, but it's removed locally.",
          variant: "default"
        });
        throw error; // Propagate error to indicate server operation failed
      }

      console.log('Document deleted from Supabase:', documentId);
      toast({
        title: "Document deleted",
        description: "Document deleted successfully from cloud and local storage."
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting document from Supabase:', error);
      // If Supabase deletion fails, the document is already removed from the local state/DB.
      // We inform the user that it's locally deleted but server deletion failed.
      toast({
        title: "Error Deleting from Server",
        description: "Document removed locally, but failed to delete from server. It may reappear if you fetch data on another device.",
        variant: "destructive"
      });
      return false; // Indicate that the full operation (including server) was not successful
    }
  }

  // Load specific document
  const loadDocument = useCallback(async (documentId: string) => {
    if (!user) return null;
    setIsLoading(true);

    try {
      const offlineDoc = await getOfflineDoc(documentId);
      if (offlineDoc) {
        // Even if loaded from offline, process its assets if online,
        // in case some assets were added via another client and only their URLs are present.
        // However, this might be intensive. For now, assume offlineDoc.data is already processed.
        // If it contains http urls and we are online, it could be re-processed.
        // Let's assume if it's from offlineDoc, its assets are either local-asset or intentionally external.
        // For simplicity, we'll only process assets when fetching from Supabase.
        // If an offline doc has an http link and we come online, a full fetchDocuments would process it.
        console.log('Document loaded from IndexedDB:', documentId);
        setCurrentDocument(offlineDoc);
        setIsLoading(false);
        return offlineDoc;
      }
    } catch (error) {
      console.warn('Could not load document from IndexedDB, will try server:', error);
    }

    if (!navigator.onLine) {
      console.log('App is offline, cannot fetch document from server:', documentId);
      toast({
        title: "Offline",
        description: "Document not found locally and you are offline.",
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }

    try {
      console.log('Loading document from Supabase:', documentId);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const loadPromise = supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      const { data: dbData, error } = await Promise.race([loadPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Supabase error loading document:', error);
        throw error;
      }

      if (dbData) {
        let dataForProcessing: string | object | undefined = undefined;
        if (typeof dbData.data === 'string') {
          dataForProcessing = dbData.data;
        } else if (typeof dbData.data === 'object' && dbData.data !== null) {
          dataForProcessing = dbData.data;
        } else if (dbData.data === null || dbData.data === undefined) {
          dataForProcessing = JSON.stringify({});
        } else {
          console.warn(`Unexpected data type for loaded doc ${dbData.id}: ${typeof dbData.data}. Stringifying.`);
          dataForProcessing = JSON.stringify(dbData.data);
        }
        const processedDataString = await processDocumentAssets(dataForProcessing, user.id, navigator.onLine);
        const docToStore = { ...dbData, data: processedDataString, synced: true };
        setCurrentDocument(docToStore);
        await saveOfflineDoc(docToStore);
        console.log('Document fetched from Supabase, assets processed, and saved to IndexedDB:', documentId);
        setIsLoading(false);
        return docToStore;
      } else {
        toast({
          title: "Not Found",
          description: "Document not found on the server.",
          variant: "destructive"
        });
        setIsLoading(false);
        return null;
      }
    } catch (error: any) {
      console.error('Error loading document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load document. It might not exist or there was a network issue.",
        variant: "destructive"
      });
      setCurrentDocument(null); 
      setIsLoading(false);
      return null;
    }
  }, [user, supabase, toast, getAllOfflineDocs, saveOfflineDoc, getOfflineDoc]); 

  // Rename document
  const renameDocument = async (id: string, newName: string) => {
    if (!user) return false;

    if (!newName.trim()) {
      toast({ title: "Error", description: "Document name cannot be empty", variant: "destructive" });
      return false;
    }

    const docToUpdate = await getOfflineDoc(id) || documents.find(doc => doc.id === id);
    if (!docToUpdate) {
      console.error('Document not found for renaming:', id);
      toast({ title: "Error", description: "Document not found for renaming.", variant: "destructive" });
      return false;
    }

    const updatedDocData = {
      ...docToUpdate,
      name: newName.trim(),
      updated_at: new Date().toISOString(),
    };

    if (!navigator.onLine || isOffline || id.startsWith('temp-')) {
      const offlineRenamedDoc = { ...updatedDocData, synced: false };
      try {
        await saveOfflineDoc(offlineRenamedDoc);
        setDocuments(prev => prev.map(doc => 
          doc.id === id ? offlineRenamedDoc : doc
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
        if (currentDocument?.id === id) {
          setCurrentDocument(offlineRenamedDoc);
        }
        toast({ title: "Document renamed locally", description: `Renamed to "${newName}"` });
        return true;
      } catch (error) {
        console.error('Error renaming document offline:', error);
        toast({ title: "Error", description: "Failed to rename document locally.", variant: "destructive" });
        return false;
      }
    }

    try {
      const { error } = await supabase
        .from('documents')
        .update({ name: newName.trim(), updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      const syncedRenamedDoc = { ...updatedDocData, name: newName.trim(), synced: true };
      await saveOfflineDoc(syncedRenamedDoc);

      setDocuments(prev => prev.map(doc => 
        doc.id === id ? syncedRenamedDoc : doc
      ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));

      if (currentDocument?.id === id) {
        setCurrentDocument(syncedRenamedDoc);
      }
      toast({ title: "Document renamed", description: `Renamed to "${newName}"` });
      return true;
    } catch (error: any) {
      console.error('Error renaming document on Supabase, saving locally:', error);
      const fallbackRenamedDoc = { ...updatedDocData, name: newName.trim(), synced: false };
      try {
        await saveOfflineDoc(fallbackRenamedDoc);
        setDocuments(prev => prev.map(doc => 
          doc.id === id ? fallbackRenamedDoc : doc
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
        if (currentDocument?.id === id) {
          setCurrentDocument(fallbackRenamedDoc);
        }
        toast({
          title: "Renamed Locally",
          description: `Changes for "${newName}" saved locally. Will sync when online.`,
          variant: "default"
        });
        return true;
      } catch (offlineError) {
        toast({ title: "Error", description: "Failed to rename document on server or locally.", variant: "destructive" });
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
