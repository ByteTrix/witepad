
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Document } from '@/hooks/useDocuments'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FileText,
  Save,
  Share2,
  Download,
  Users,
  Settings,
  ArrowLeft,
  MoreHorizontal,
  Loader2
} from 'lucide-react'

interface EditorHeaderProps {
  currentDocument?: Document | null
  onSave: () => Promise<boolean>
  isSaving: boolean
}

export const EditorHeader = ({ currentDocument, onSave, isSaving }: EditorHeaderProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isExporting, setIsExporting] = useState(false)

  const handleSave = async () => {
    await onSave()
  }

  const handleExport = async (format: 'png' | 'svg') => {
    setIsExporting(true)
    // Placeholder for export functionality
    setTimeout(() => {
      setIsExporting(false)
    }, 1000)
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-background/95 backdrop-blur-sm border-b border-border/40 relative z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/documents')}
          className="p-2 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-medium truncate max-w-[200px]">
              {currentDocument?.name || 'Untitled Drawing'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 px-3 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all"
          >
            {isSaving ? (
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            ) : (
              <Save className="h-3 w-3 mr-2" />
            )}
            <span className="text-xs">Save</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-all"
              >
                <Share2 className="h-3 w-3 mr-2" />
                <span className="text-xs">Share</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Invite collaborators
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('png')} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('svg')} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                Export as SVG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-8 w-8 p-0 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
