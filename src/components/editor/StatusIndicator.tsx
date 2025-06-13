
import { Document } from '@/hooks/useDocuments'
import { Loader2, Wifi, WifiOff, Clock, AlertCircle } from 'lucide-react'

interface StatusIndicatorProps {
  isConnected: boolean
  isOffline: boolean
  hasUnsavedChanges: boolean
  lastSaveTime: Date | null
  currentDocument?: Document | null
  isSaving: boolean
}

export const StatusIndicator = ({
  isConnected,
  isOffline,
  hasUnsavedChanges,
  lastSaveTime,
  currentDocument,
  isSaving
}: StatusIndicatorProps) => {
  const getStatusColor = () => {
    if (isOffline) return 'bg-yellow-500'
    if (isSaving) return 'bg-blue-500'
    if (hasUnsavedChanges) return 'bg-orange-500'
    if (isConnected) return 'bg-green-500'
    return 'bg-red-500'
  }

  const getStatusText = () => {
    if (isOffline) return 'Offline Mode'
    if (isSaving) return 'Saving...'
    if (hasUnsavedChanges) return 'Unsaved'
    if (isConnected) return 'Synced'
    return 'Offline'
  }

  const getStatusIcon = () => {
    if (isSaving) return <Loader2 className="h-3 w-3 animate-spin" />
    if (isOffline || !isConnected) return <WifiOff className="h-3 w-3" />
    if (hasUnsavedChanges) return <AlertCircle className="h-3 w-3" />
    return <Wifi className="h-3 w-3" />
  }

  return (
    <div className="absolute top-20 left-6 z-40 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 border border-border/40 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>
      
      {lastSaveTime && !isOffline && (
        <>
          <div className="w-px h-3 bg-border/40"></div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {lastSaveTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </>
      )}
      
      {currentDocument && !isOffline && (
        <>
          <div className="w-px h-3 bg-border/40"></div>
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {currentDocument.name}
          </span>
        </>
      )}
    </div>
  )
}
