import { useEffect, useState, useMemo, useRef } from 'react'
import { useDocuments, Document } from '@/hooks/useDocuments'
import { DocumentsHeader } from '@/components/DocumentsHeader'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Trash2, Calendar, Search, ArrowDownAZ, ArrowUpZA, Clock, Loader2, Edit, Check, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const Documents = () => {
  const { user } = useAuth()
  const { documents, isLoading, createDocument, deleteDocument, fetchDocuments, renameDocument } = useDocuments()
  const navigate = useNavigate()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'a-z' | 'z-a'>('newest')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])
  
  // Focus input when renaming starts
  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus()
    }
  }, [renamingId])
  
  // Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    await fetchDocuments();
    setIsRefreshing(false);
  };

  const handleCreateDocument = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const doc = await createDocument('Untitled Drawing')
      if (doc) {
        navigate(`/editor/${doc.id}`)
      }
    } finally {
      setIsCreating(false);
    }
  }

  const handleOpenDocument = (id: string) => {
    navigate(`/editor/${id}`)
  }

  const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      const success = await deleteDocument(id)
      if (!success) {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setDeletingId(null)
    }
  }

  const handleStartRename = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingId(doc.id)
    setNewName(doc.name)
  }
  
  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingId(null)
    setNewName('')
  }
  
  const handleSubmitRename = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!newName.trim() || newName.trim() === documents.find(d => d.id === id)?.name) {
      setRenamingId(null)
      setNewName('')
      return
    }
    
    const success = await renameDocument(id, newName.trim())
    if (success) {
      setRenamingId(null)
      setNewName('')
    }
  }

  const handleRenameKeyDown = async (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!newName.trim() || newName.trim() === documents.find(d => d.id === id)?.name) {
        setRenamingId(null)
        setNewName('')
        return
      }
      
      const success = await renameDocument(id, newName.trim())
      if (success) {
        setRenamingId(null)
        setNewName('')
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setRenamingId(null)
      setNewName('')
    }
  }
  
  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...documents];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc.name.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortOrder) {
      case 'newest':
        return result.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      case 'oldest':
        return result.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
      case 'a-z':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return result;
    }
  }, [documents, searchQuery, sortOrder]);
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <DocumentsHeader />
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Documents</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-sm">
                  {sortOrder === 'newest' && <Clock className="mr-2 h-4 w-4" />}
                  {sortOrder === 'oldest' && <Clock className="mr-2 h-4 w-4" />}
                  {sortOrder === 'a-z' && <ArrowDownAZ className="mr-2 h-4 w-4" />}
                  {sortOrder === 'z-a' && <ArrowUpZA className="mr-2 h-4 w-4" />}
                  Sort: {sortOrder === 'newest' ? 'Newest' : 
                         sortOrder === 'oldest' ? 'Oldest' : 
                         sortOrder === 'a-z' ? 'A to Z' : 'Z to A'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                  <Clock className="mr-2 h-4 w-4" />
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                  <Clock className="mr-2 h-4 w-4" />
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('a-z')}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  A to Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('z-a')}>
                  <ArrowUpZA className="mr-2 h-4 w-4" />
                  Z to A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className={isRefreshing ? 'animate-spin' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 21h5v-5" />
              </svg>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedDocuments.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            {searchQuery ? (
              <>
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium">No matching documents</h2>
                <p className="text-muted-foreground">Try a different search term</p>
                <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-4">
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium">No documents yet</h2>
                <p className="text-muted-foreground">Create your first document to get started</p>
                <Button onClick={handleCreateDocument} className="mt-4" disabled={isCreating}>
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Create Document
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedDocuments.map((doc: Document) => (
              <div
                key={doc.id}
                onClick={() => handleOpenDocument(doc.id)}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer group space-y-2 relative"
              >
                <div className="flex items-start justify-between">
                  {renamingId === doc.id ? (
                    <div className="flex items-center w-full space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Input 
                        ref={inputRef}
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(doc.id, e)}
                        className="h-8 text-lg font-medium"
                        placeholder="Document name"
                      />
                      <div className="flex space-x-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={(e) => handleSubmitRename(doc.id, e)}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={handleCancelRename}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-lg font-medium truncate group-hover:text-primary transition-colors flex-1">
                      {doc.name}
                    </h3>
                  )}
                  {doc.id.startsWith('temp-') && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Offline</span>
                  )}
                  {!doc.synced && !doc.id.startsWith('temp-') && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full ml-2">Not synced</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2 opacity-70" />
                  {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                </p>
                <div className="pt-4 flex justify-end space-x-2">
                  {!renamingId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleStartRename(doc, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => handleDeleteDocument(doc.id, e)}
                    disabled={deletingId === doc.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Documents
