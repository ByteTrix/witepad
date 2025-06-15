
import { useState, useEffect } from 'react'

// TopPanel: Clean centered logo and app name
export const TopPanel = ({ documentId }: { documentId?: string }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 200,
      pointerEvents: 'all',
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        padding: '6px 12px',
        borderRadius: 8,
        backgroundColor: 'var(--color-panel)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        position: 'relative',
      }}>
        <div style={{ position: 'relative' }}>
          <img 
            src="/witepad-logo.png" 
            alt="Witepad" 
            style={{ 
              height: 24,
              width: 24,
              borderRadius: 3
            }} 
          />
          {/* Connection status indicator - only when offline */}
          {!isOnline && (
            <div style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              border: '2px solid var(--color-panel)',
              opacity: 0.9
            }} />
          )}
        </div>
          <span 
          className="font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent"
          style={{ 
            fontSize: 14,
            letterSpacing: '-0.01em'
          }}        >
          Witepad
        </span>
      </div>
    </div>
  )
}
