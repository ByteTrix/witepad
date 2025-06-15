
import { useEffect, useState, useMemo, useRef } from 'react'
import { useDocuments, Document } from '@/hooks/useDocuments'
import { DocumentsHeader } from '@/components/DocumentsHeader'
import { SyncStatus } from '@/components/SyncStatus'
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
    }  }, [documents, searchQuery, sortOrder]);
  
  if (!user) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-900 relative overflow-hidden">
      {/* Premium animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-pulse opacity-70" />
        <div className="absolute -bottom-1/3 -left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/30 via-blue-500/20 to-indigo-500/10 rounded-full blur-3xl animate-pulse opacity-70" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: '4s' }} />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-32 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-gradient-to-r from-violet-400 to-indigo-500 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '5s' }} />
      </div>
      
      <div className="relative z-10">
        <DocumentsHeader />
        <div className="px-6 pt-12 pb-8 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
              My Documents
            </h1>
            <SyncStatus 
              isSynced={navigator.onLine && documents.every(doc => doc.synced !== false)}
              isLocalOnly={!navigator.onLine}
              className="bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-in fade-in-0 slide-in-from-top-6 duration-1000 delay-200">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-300" />
              <Input
                placeholder="Search documents..."
                className="pl-12 h-12 bg-black/30 backdrop-blur-xl border-white/20 hover:border-indigo-400/50 focus:border-cyan-400/70 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/25 focus:shadow-cyan-500/25 text-white placeholder:text-indigo-200 rounded-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="text-sm bg-black/30 backdrop-blur-xl border-white/20 hover:border-indigo-400/50 hover:bg-indigo-500/20 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/25 text-white rounded-2xl h-12">
                    {sortOrder === 'newest' && <Clock className="mr-3 h-5 w-5" />}
                    {sortOrder === 'oldest' && <Clock className="mr-3 h-5 w-5" />}
                    {sortOrder === 'a-z' && <ArrowDownAZ className="mr-3 h-5 w-5" />}
                    {sortOrder === 'z-a' && <ArrowUpZA className="mr-3 h-5 w-5" />}
                    Sort: {sortOrder === 'newest' ? 'Newest' : 
                           sortOrder === 'oldest' ? 'Oldest' : 
                           sortOrder === 'a-z' ? 'A to Z' : 'Z to A'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/60 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl">
                  <DropdownMenuItem onClick={() => setSortOrder('newest')} className="hover:bg-indigo-500/30 transition-colors duration-300 text-white rounded-xl">
                    <Clock className="mr-3 h-5 w-5" />
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('oldest')} className="hover:bg-indigo-500/30 transition-colors duration-300 text-white rounded-xl">
                    <Clock className="mr-3 h-5 w-5" />
                    Oldest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('a-z')} className="hover:bg-indigo-500/30 transition-colors duration-300 text-white rounded-xl">
                    <ArrowDownAZ className="mr-3 h-5 w-5" />
                    A to Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('z-a')} className="hover:bg-indigo-500/30 transition-colors duration-300 text-white rounded-xl">
                    <ArrowUpZA className="mr-3 h-5 w-5" />
                    Z to A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>            
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                className={`bg-black/30 backdrop-blur-xl border border-white/20 hover:border-indigo-400/50 hover:bg-indigo-500/20 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/25 text-white rounded-2xl h-12 w-12 ${isRefreshing ? 'animate-spin' : 'hover:scale-110'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in-0 duration-700">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-white/20 rounded-3xl p-8 space-y-6 bg-black/30 backdrop-blur-xl shadow-2xl animate-pulse">
                  <Skeleton className="h-8 w-3/4 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-2xl" />
                  <Skeleton className="h-6 w-1/2 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-2xl" />
                  <div className="pt-6">
                    <Skeleton className="h-12 w-full bg-gradient-to-r from-violet-400/30 to-pink-400/30 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedDocuments.length === 0 ? (
            <div className="text-center py-20 space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
              {searchQuery ? (
                <>
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500/40 to-purple-500/40 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-xl border border-white/20">
                    <Search className="h-10 w-10 text-indigo-200" />
                  </div>
                  <h2 className="text-2xl font-medium bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">No matching documents</h2>
                  <p className="text-indigo-300">Try a different search term</p>
                  <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-6 bg-black/30 backdrop-blur-xl border-white/20 hover:border-indigo-400/50 hover:bg-indigo-500/20 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/25 hover:scale-105 text-white rounded-2xl h-12">
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500/40 to-indigo-500/40 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-xl border border-white/20">
                    <FileText className="h-10 w-10 text-cyan-200" />
                  </div>
                  <h2 className="text-2xl font-medium bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">No documents yet</h2>
                  <p className="text-cyan-300">Create your first document to get started</p>
                  <Button onClick={handleCreateDocument} className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-2xl hover:shadow-indigo-500/50 transition-all duration-500 hover:scale-105 border-0 text-white rounded-2xl h-12" disabled={isCreating}>
                    {isCreating ? (
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    ) : (
                      <Plus className="mr-3 h-5 w-5" />
                    )}
                    Create Document
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedDocuments.map((doc: Document, index) => (
                <div
                  key={doc.id}
                  onClick={() => handleOpenDocument(doc.id)}
                  className="border border-white/20 rounded-3xl p-8 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-700 cursor-pointer group space-y-4 relative bg-black/30 backdrop-blur-xl hover:scale-105 hover:border-indigo-400/50 animate-in fade-in-0 slide-in-from-bottom-4 hover:bg-black/40"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationDuration: '1000ms'
                  }}
                >
                  {/* Premium gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
                  
                  <div className="flex items-start justify-between relative z-10">
                    {renamingId === doc.id ? (
                      <div className="flex items-center w-full space-x-3" onClick={(e) => e.stopPropagation()}>
                        <Input 
                          ref={inputRef}
                          value={newName} 
                          onChange={(e) => setNewName(e.target.value)}
                          onKeyDown={(e) => handleRenameKeyDown(doc.id, e)}
                          className="h-10 text-lg font-medium bg-black/40 backdrop-blur-xl border-white/30 focus:border-cyan-400/70 transition-all duration-500 shadow-xl text-white rounded-2xl"
                          placeholder="Document name"
                        />
                        <div className="flex space-x-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-10 w-10 hover:bg-green-500/30 hover:text-green-300 transition-all duration-500 shadow-xl hover:scale-110 rounded-2xl"
                            onClick={(e) => handleSubmitRename(doc.id, e)}
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-10 w-10 hover:bg-red-500/30 hover:text-red-300 transition-all duration-500 shadow-xl hover:scale-110 rounded-2xl"
                            onClick={handleCancelRename}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <h3 className="text-xl font-semibold truncate group-hover:text-cyan-200 transition-all duration-500 flex-1 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-indigo-200">
                        {doc.name}
                      </h3>
                    )}
                    {doc.id.startsWith('temp-') && (
                      <span className="text-xs px-3 py-2 bg-gradient-to-r from-amber-400/40 to-orange-500/40 text-amber-200 rounded-full border border-amber-400/50 backdrop-blur-xl shadow-xl">Offline</span>
                    )}
                    {!doc.synced && !doc.id.startsWith('temp-') && (
                      <span className="text-xs px-3 py-2 bg-gradient-to-r from-blue-400/40 to-cyan-500/40 text-blue-200 rounded-full border border-blue-400/50 backdrop-blur-xl ml-3 shadow-xl">Not synced</span>
                    )}
                  </div>
                  <p className="text-sm text-indigo-300 flex items-center group-hover:text-cyan-300 transition-colors duration-500 relative z-10">
                    <Calendar className="h-4 w-4 mr-3 opacity-70" />
                    {formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}
                  </p>
                  <div className="pt-6 flex justify-end space-x-3 relative z-10">
                    {!renamingId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleStartRename(doc, e)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 bg-black/40 backdrop-blur-xl border-white/30 hover:border-indigo-400/50 hover:bg-indigo-500/30 shadow-xl hover:shadow-indigo-500/30 text-white rounded-2xl"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                      disabled={deletingId === doc.id}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 bg-gradient-to-r from-red-500/80 to-pink-600/80 hover:from-red-500 hover:to-pink-600 shadow-xl hover:shadow-red-500/30 border-0 text-white rounded-2xl"
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
    </div>
  )
}

export default Documents
