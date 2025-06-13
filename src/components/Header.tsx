import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuShortcut
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { AuthDialog } from './AuthDialog'
import { 
  LogOut, 
  User, 
  Settings, 
  Save, 
  Share2, 
  FileText, 
  Plus, 
  FolderOpen, 
  Palette, 
  Loader2, 
  Download,
  Copy,
  Trash2,
  FileOutput,
  RefreshCw,
  UserPlus,
  Lock,
  Unlock,
  Star,
  StarOff,
  HelpCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDocuments } from '@/hooks/useDocuments'
import { toast } from '@/components/ui/use-toast'

export const Header = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { createDocument, updateDocument, currentDocument, isLoading } = useDocuments()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [isCreatingDocument, setIsCreatingDocument] = useState(false)
  const [isSavingDocument, setIsSavingDocument] = useState(false)
  const [isPrivacyMenuOpen, setIsPrivacyMenuOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  // Handle new document creation
  const handleNewDocument = async () => {
    if (isCreatingDocument) return;
    
    try {
      setIsCreatingDocument(true);
      const doc = await createDocument('Untitled Drawing')
      if (doc) {
        navigate(`/editor/${doc.id}`)
      }
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: "Failed to create a new document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingDocument(false);
    }
  }

  // Handle opening documents list
  const handleOpenDocuments = () => {
    navigate('/documents')
  }

  // Handle saving document
  const handleSaveDocument = async () => {
    if (!currentDocument || isSavingDocument) return;
    
    try {
      setIsSavingDocument(true);
      const success = await updateDocument(currentDocument.id, {
        name: currentDocument.name
      })
      
      if (success) {
        toast({
          title: "Document saved",
          description: "Your document has been saved successfully",
        })
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error",
        description: "Failed to save document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingDocument(false);
    }
  }

  // Handle profile navigation
  const handleProfile = () => {
    navigate('/profile')
  }

  // Handle my documents navigation
  const handleMyDocuments = () => {
    navigate('/documents')
  }

  // Handle settings navigation
  const handleSettings = () => {
    navigate('/settings')
  }

  // Handle duplicating document
  const handleDuplicateDocument = async () => {
    if (!currentDocument || isDuplicating) return;
    
    try {
      setIsDuplicating(true);
      const doc = await createDocument(`${currentDocument.name} (Copy)`);
      
      if (doc) {
        // Here we would copy over the data from the current document
        const success = await updateDocument(doc.id, {
          data: currentDocument.data,
          snapshot: currentDocument.snapshot
        });
        
        if (success) {
          toast({
            title: "Document duplicated",
            description: "Your document has been duplicated successfully"
          });
          
          // Navigate to the new document
          navigate(`/editor/${doc.id}`);
        }
      }
    } catch (error) {
      console.error('Error duplicating document:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDuplicating(false);
    }
  }

  // Handle exporting document
  const handleExportDocument = async () => {
    if (!currentDocument || isExporting) return;
    
    try {
      setIsExporting(true);
      
      // Here we would implement the export logic
      // This is a placeholder for actual export functionality
      setTimeout(() => {
        toast({
          title: "Document exported",
          description: "Your document has been exported successfully",
        });
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Error exporting document:', error);
      toast({
        title: "Error",
        description: "Failed to export document. Please try again.",
        variant: "destructive"
      });
      setIsExporting(false);
    }
  }

  // Handle toggling document privacy
  const handleTogglePrivacy = async () => {
    if (!currentDocument) return;
    
    try {
      setIsPrivacyMenuOpen(false);
      const newPrivacy = !currentDocument.is_public;
      
      const success = await updateDocument(currentDocument.id, {
        is_public: newPrivacy
      });
      
      if (success) {
        toast({
          title: newPrivacy ? "Document is now public" : "Document is now private",
          description: newPrivacy 
            ? "Anyone with the link can now view this document" 
            : "Only you can access this document now"
        });
      }
    } catch (error) {
      console.error('Error updating document privacy:', error);
      toast({
        title: "Error",
        description: "Failed to update document privacy. Please try again.",
        variant: "destructive"
      });
    }
  }

  // Handle toggling favorite status
  const handleToggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "Document removed from favorites" 
        : "Document added to favorites"
    });
  }

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Palette className="h-4 w-4 text-white" />
              </div>              
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Witepad
              </h1>
            </div>
            
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={handleNewDocument}
                  disabled={isCreatingDocument || isLoading}
                >
                  {isCreatingDocument ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  New
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={handleOpenDocuments}>
                      <FileText className="mr-2 h-4 w-4" />
                      All Documents
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleNewDocument}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Document
                      <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground"
                      disabled={!currentDocument || isSavingDocument}
                    >
                      {isSavingDocument ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem onClick={handleSaveDocument}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDocument} disabled={isExporting}>
                      {isExporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      Export as PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportDocument} disabled={isExporting}>
                      {isExporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FileOutput className="mr-2 h-4 w-4" />
                      )}
                      Export as SVG
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground"
                      disabled={!currentDocument || isLoading}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>Share Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleTogglePrivacy}>
                      {currentDocument?.is_public ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" />
                          Make Public
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Collaborators
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDuplicateDocument} disabled={isDuplicating}>
                      {isDuplicating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleFavorite}>
                      {isFavorite ? (
                        <>
                          <StarOff className="mr-2 h-4 w-4" />
                          Remove from Favorites
                        </>
                      ) : (
                        <>
                          <Star className="mr-2 h-4 w-4" />
                          Add to Favorites
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          <div>
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative w-10 h-10 rounded-full">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfile}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleMyDocuments}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>My Documents</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettings}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
      />
    </>
  )
}
