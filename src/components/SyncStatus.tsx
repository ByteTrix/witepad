
import React from 'react'
import { Wifi, WifiOff, Cloud, CloudOff, Loader2 } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

interface SyncStatusProps {
  isSynced?: boolean
  isLocalOnly?: boolean
  isSyncing?: boolean
  className?: string
}

export const SyncStatus = ({ 
  isSynced = true, 
  isLocalOnly = false, 
  isSyncing = false,
  className = "" 
}: SyncStatusProps) => {
  const { isOnline } = usePWA()

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500'
    if (isSyncing) return 'bg-blue-500'
    if (isLocalOnly) return 'bg-yellow-500'
    if (isSynced) return 'bg-green-500'
    return 'bg-orange-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (isSyncing) return 'Syncing...'
    if (isLocalOnly) return 'Local Only'
    if (isSynced) return 'Synced'
    return 'Not Synced'
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-3 w-3" />
    if (isSyncing) return <Loader2 className="h-3 w-3 animate-spin" />
    if (isLocalOnly) return <CloudOff className="h-3 w-3" />
    return <Cloud className="h-3 w-3" />
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
      <div className="flex items-center gap-1 text-muted-foreground">
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    </div>
  )
}
