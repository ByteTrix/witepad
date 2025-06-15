import React from 'react'
import { Wifi, WifiOff, Cloud, CloudOff, Loader2 } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

interface SyncStatusProps {
  isOffline?: boolean; // Changed from isLocalOnly
  isSynced?: boolean
  isSyncing?: boolean
  className?: string
}

export const SyncStatus = ({ 
  isOffline = false, // Default to online
  isSynced = true, 
  isSyncing = false,
  className = "" 
}: SyncStatusProps) => {
  // const { isOnline } = usePWA() // isOffline prop will now primarily drive this

  const getStatusColor = () => {
    if (isOffline) return 'bg-gray-500'; // Consistent "Offline" color
    if (isSyncing) return 'bg-blue-500';
    if (isSynced) return 'bg-green-500';
    return 'bg-yellow-500'; // Default to "Not Synced" or "Sync Pending" when online
  };

  const getStatusText = () => {
    if (isOffline) return 'Offline';
    if (isSyncing) return 'Syncing...';
    if (isSynced) return 'Synced';
    return 'Sync Pending'; // More accurate for online but not fully synced
  };

  const getStatusIcon = () => {
    if (isOffline) return <WifiOff className="h-3 w-3" />;
    if (isSyncing) return <Loader2 className="h-3 w-3 animate-spin" />;
    // For online states, Cloud icon is generally appropriate.
    // Could differentiate between Synced and Sync Pending if desired, but Cloud works for both.
    if (isSynced) return <Cloud className="h-3 w-3" />;
    return <CloudOff className="h-3 w-3" />; // Icon for "Sync Pending"
  };

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
