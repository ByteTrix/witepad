import { Tldraw, TLComponents, TLUserPreferences, useTldrawUser, useToasts, createTLStore, defaultShapeUtils, defaultBindingUtils, TLRecord, TLAsset, TLImageAsset, TLVideoAsset } from 'tldraw'
import 'tldraw/tldraw.css'
import { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { useDocuments, Document } from '@/hooks/useDocuments'
import { useAuth } from '@/contexts/AuthContext'
import { TopPanel, SharePanel } from './editor/EditorHeader'
import { usePWA } from '@/hooks/usePWA'
import { getAssetData } from '@/lib/offline-db'; // Added import

interface SimpleEditorProps {
  documentId?: string
  isPublicRoom?: boolean
}

// Component that handles keyboard shortcuts and uses tldraw's toast system
// This will be integrated into the TopPanel component
const useKeyboardShortcuts = (onCloudSave: () => void, isPublicRoom: boolean, hasUser: boolean) => {
  const { addToast } = useToasts()

  const handleCloudSaveWithToast = useCallback(() => {
    if (isPublicRoom || !hasUser) {
      addToast({
        title: 'Cannot save',
        description: 'Sign in to save your work to the cloud',
        severity: 'info'
      })
      return
    }
    
    try {
      onCloudSave()
      addToast({
        title: 'Saved to cloud',
        description: 'Your drawing has been saved successfully',
        severity: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Save failed',
        description: 'Failed to save your drawing to the cloud',
        severity: 'error'
      })
    }
  }, [onCloudSave, addToast, isPublicRoom, hasUser])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'S' && e.shiftKey) {
        e.preventDefault()
        handleCloudSaveWithToast()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleCloudSaveWithToast])
}

// Enhanced TopPanel that includes keyboard shortcuts
const TopPanelWithShortcuts = ({ onCloudSave, isPublicRoom, hasUser, documentId }: any) => {
  useKeyboardShortcuts(onCloudSave, isPublicRoom, hasUser)
  return <TopPanel documentId={documentId} />
}

// Custom PageMenu component that shows document name
const CustomPageMenu = ({ documentId, currentDocument, renameDocument }: { documentId?: string, currentDocument: Document | null, renameDocument: (id: string, newName: string) => Promise<boolean> }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Memoize document name to avoid unnecessary re-renders
  const documentName = useMemo(() => {
    if (currentDocument && currentDocument.id === documentId) {
      return currentDocument.name
    }
    return documentId ? 'Loading...' : 'Untitled Document'
  }, [documentId, currentDocument?.name]) // Only depend on the actual name property

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    if (!documentId) return
    setTempName(documentName)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setTempName('')
  }
  const handleSaveEdit = async () => {
    if (!documentId || !tempName.trim()) {
      handleCancelEdit()
      return
    }

    if (tempName.trim() === documentName) {
      handleCancelEdit()
      return
    }

    try {
      const success = await renameDocument(documentId, tempName.trim())
      if (success) {
        // Document name will update automatically via memoized value
        setIsEditing(false)
        setTempName('')
      }
    } catch (error) {
      console.error('Error renaming document:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--color-text)',
      pointerEvents: 'all'
    }}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveEdit}
          style={{
            background: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            padding: '4px 8px',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--color-text)',
            outline: 'none',
            minWidth: '120px'
          }}
          placeholder="Document name"
        />
      ) : (
        <>
          <span 
            style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '150px'
            }}
            title={documentName}
          >
            {documentName}
          </span>
          <button
            onClick={handleStartEdit}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-text-3)',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-3)'
            }}
            title="Edit document name"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

export const SimpleEditor = ({ documentId, isPublicRoom = false }: SimpleEditorProps) => {
  const { updateDocument, loadDocument, currentDocument, renameDocument } = useDocuments({ skipInitialFetch: true })
  const { user } = useAuth()
  const { isOnline } = usePWA()
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    if (documentId) {
      loadDocument(documentId)
    }
  }, [documentId, loadDocument])

  // Create user preferences with custom user data
  const [userPreferences, setUserPreferences] = useState<TLUserPreferences>(() => {
    if (isPublicRoom && !user) {
      // For public rooms without authentication, create anonymous user
      return {
        id: 'anonymous-' + Math.random().toString(36).substr(2, 9),
        name: 'Anonymous',
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        colorScheme: 'system',
      }
    }
    return {
      id: user?.id || 'user-' + Math.random(),
      name: user?.email?.split('@')[0] || 'Anonymous',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      colorScheme: 'system',
    }
  })

  // Update user preferences when auth user changes (only for authenticated users)
  useEffect(() => {
    if (user && !isPublicRoom) {
      setUserPreferences(prev => ({
        ...prev,
        id: user.id,
        name: user.email?.split('@')[0] || 'Anonymous',
      }))
    }  }, [user, isPublicRoom])
  
  // Create a local TLDraw store instead of using useSyncDemo for better performance
  // This removes unnecessary collaboration overhead since we handle multi-user via Supabase
  const store = useMemo(() => {
    return createTLStore({
      shapeUtils: defaultShapeUtils,
      bindingUtils: defaultBindingUtils,
    })
  }, [])

  // Load document data into store when document is loaded
  useEffect(() => {
    if (currentDocument && currentDocument.data && store) {
      const loadAndProcessRecords = async () => {
        try {
          let recordsToProcess: TLRecord[];

          // Robust parsing of currentDocument.data
          if (typeof currentDocument.data === 'string') {
            const parsedJson = JSON.parse(currentDocument.data);
            if (Array.isArray(parsedJson)) {
              recordsToProcess = parsedJson as TLRecord[];
            } else if (typeof parsedJson === 'object' && parsedJson !== null && Object.keys(parsedJson).length === 0) {
              recordsToProcess = []; // Handle empty tldraw doc from "{}" string
            } else {
              console.error('SimpleEditor: Parsed document data string is not an array or empty object. Data:', parsedJson);
              return; // Exit if format is unexpected
            }
          } else if (Array.isArray(currentDocument.data)) {
            recordsToProcess = currentDocument.data as TLRecord[];
          } else if (currentDocument.data && typeof currentDocument.data === 'object' && Object.keys(currentDocument.data).length === 0) {
            recordsToProcess = []; // Handle if currentDocument.data is an actual empty JS object
          } else {
            console.error('SimpleEditor: currentDocument.data is not a string or a recognized array/object format. Data:', currentDocument.data);
            return; // Exit if format is unexpected
          }

          if (!recordsToProcess) {
            console.error('SimpleEditor: recordsToProcess is undefined after parsing. This should not happen.');
            return;
          }
          
          const processedRecords: TLRecord[] = await Promise.all(
            recordsToProcess.map(async (record: TLRecord): Promise<TLRecord> => {
              if (record.typeName === 'asset') {
                const assetRecord = record as TLAsset;
                const assetIdForLog = assetRecord.id;

                if (
                  (assetRecord.type === 'image' || assetRecord.type === 'video') &&
                  assetRecord.props?.src?.startsWith('local-asset:')
                ) {
                  const originalSrc = assetRecord.props.src;
                  const assetId = originalSrc.replace('local-asset:', '');
                  console.log(`SimpleEditor: Processing local-asset for asset ID '${assetIdForLog}' (derived key '${assetId}') with original src: ${originalSrc}`);
                  try {
                    const assetData = await getAssetData(assetId);
                    if (assetData instanceof Blob) {
                      // Convert Blob to data URL
                      const dataUrl = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') resolve(reader.result);
                          else reject(new Error('Failed to convert Blob to data URL'));
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(assetData);
                      });
                      console.log(`SimpleEditor: Successfully converted asset ID '${assetIdForLog}' (key '${assetId}') to data URL.`);
                      if (assetRecord.type === 'image') {
                        const specificAsset = assetRecord as TLImageAsset;
                        return {
                           ...specificAsset,
                           props: { ...specificAsset.props, src: dataUrl },
                        } as TLImageAsset; 
                      } else if (assetRecord.type === 'video') {
                         const specificAsset = assetRecord as TLVideoAsset;
                         return {
                           ...specificAsset,
                           props: { ...specificAsset.props, src: dataUrl },
                         } as TLVideoAsset; 
                      }
                    } else {
                      console.warn(`SimpleEditor: Asset data for asset ID '${assetIdForLog}' (key '${assetId}', src: ${originalSrc}) is NOT a Blob. Actual type: ${typeof assetData}, Data:`, assetData, `Original record with local-asset src will be used.`);
                    }
                  } catch (error) {
                    console.error(`SimpleEditor: Error fetching/processing asset data for asset ID '${assetIdForLog}' (key '${assetId}', src: ${originalSrc}):`, error, `Original record with local-asset src will be used.`);
                  }
                }
              }
              return record; 
            })
          );

          // console.log("SimpleEditor: Attempting to put processed records into store:", processedRecords);
          if (recordsToProcess.length === 0 && processedRecords.length === 0) {
            store.put([]); // Explicitly put empty array if original was empty
            // console.log("SimpleEditor: Successfully put empty array into store for empty document.");
          } else if (processedRecords.length > 0) {
            store.put(processedRecords);
            // console.log("SimpleEditor: Successfully put records into store.");
          } else if (recordsToProcess.length > 0 && processedRecords.length === 0) {
            console.warn("SimpleEditor: Original records existed, but processed records array is empty. This might indicate all records failed processing or were filtered out. Not putting into store to avoid clearing content unintentionally.");
          }
          // If recordsToProcess was empty and processedRecords is also empty, store.put([]) is fine.

        } catch (error) { 
          console.error('SimpleEditor: Error loading document data into store (outer catch):', error);
        }
      };

      loadAndProcessRecords();
    }
    // TODO: Consider revoking object URLs in a cleanup function
    // This effect should ideally have a cleanup that iterates through any created blob URLs
    // and calls URL.revokeObjectURL() for each. This would require storing the generated
    // blob URLs, perhaps in a ref.
  }, [currentDocument, store]);

  // Create tldraw user object
  const tldrawUser = useTldrawUser({ userPreferences, setUserPreferences })  
  
  // Cloud save function (without toast - toast is handled in the KeyboardShortcuts component)
  const handleCloudSave = useCallback(async () => {
    if (isPublicRoom || !user || !documentId || !store) return
    
    setIsSaving(true)
    setHasUnsavedChanges(false)
    
    try {
      const allRecords = store.allRecords()
      await updateDocument(documentId, {
        data: JSON.stringify(allRecords),
        snapshot: JSON.stringify(allRecords),
      })
      setLastSaveTime(new Date())
    } catch (error) {
      console.error('Error saving to cloud:', error)
      setHasUnsavedChanges(true)
    } finally {
      setIsSaving(false)
    }
  }, [user, documentId, store, updateDocument, isPublicRoom])

  // Configure custom UI zones
  const components: TLComponents = useMemo(() => ({
    TopPanel: () => (
      <TopPanelWithShortcuts
        onCloudSave={handleCloudSave}
        isPublicRoom={isPublicRoom}
        hasUser={!!user}
        documentId={documentId}
      />
    ),
    SharePanel: () => (
      <SharePanel 
        documentId={documentId} 
        userPreferences={userPreferences}
        setUserPreferences={setUserPreferences}
      />
    ),
    PageMenu: () => (
      <CustomPageMenu documentId={documentId} currentDocument={currentDocument} renameDocument={renameDocument} />
    ),
  }), [documentId, userPreferences, setUserPreferences, handleCloudSave, isPublicRoom, user, currentDocument, renameDocument])  

  // Auto-save changes (works offline-first, always saves locally first)
  useEffect(() => {
    if (isPublicRoom || !user || !documentId || !store) return
    
    const unsubscribe = store.listen(
      () => {
        setHasUnsavedChanges(true)
        
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
        
        debounceTimeoutRef.current = setTimeout(async () => {
          const allRecords = store.allRecords()
          const dataString = JSON.stringify(allRecords)
          
          // Use updateDocument to save to IndexedDB and then Supabase
          try {
            setIsSaving(true); // Indicate saving process
            const success = await updateDocument(documentId, {
              data: dataString, // Send as string, useDocuments handles parsing if needed for its own state
              // snapshot: dataString, // Optionally, if you want to update snapshot simultaneously
            });
            if (success) {
              setHasUnsavedChanges(false);
              setLastSaveTime(new Date());
              console.log('Auto-saved document:', documentId);
            } else {
              console.error('Auto-save failed for document:', documentId);
              // Keep hasUnsavedChanges true if save failed
            }
          } catch (error) {
            console.error('Error during auto-save:', error)
            // Keep hasUnsavedChanges true on error
          } finally {
            setIsSaving(false);
          }
        }, 1500) // Debounce auto-save e.g., every 1.5 seconds
      },
      { scope: 'document', source: 'user' } // Only listen to user changes on the document
    )
    
    return () => {
      unsubscribe()
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [store, documentId, user, isPublicRoom, updateDocument, setIsSaving, setHasUnsavedChanges, setLastSaveTime])  

  // Effect to handle initial load and online/offline status for current document
  useEffect(() => {
    if (!documentId || isPublicRoom) return
    
    const handleOnline = () => {
      console.log('Back online, syncing changes...')
      // Try to re-save document if there were unsaved changes
      if (hasUnsavedChanges) {
        handleCloudSave()
      }
    }
    
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [documentId, isPublicRoom, hasUnsavedChanges, handleCloudSave])

  if (!store) return null

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw 
        store={store} 
        components={components}
        user={tldrawUser}
        inferDarkMode 
      />
    </div>
  )
}
