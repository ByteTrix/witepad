
import { useEditor } from 'tldraw'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import { EditorUserAvatar } from './EditorUserAvatar'

// SharePanel: User avatar on left, collaborator list on right with separate dropdowns
export const SharePanel = ({ documentId, userPreferences, setUserPreferences }: { 
  documentId?: string
  userPreferences?: any
  setUserPreferences?: (prefs: any) => void 
}) => {
  const editor = useEditor()
  const { user } = useAuth()
  const [isCollaboratorDropdownOpen, setIsCollaboratorDropdownOpen] = useState(false)
  const collaboratorDropdownRef = useRef<HTMLDivElement>(null)
  // Get collaborators from editor
  const collaborators = editor.store.query.records('instance_presence').get()
  
  // Ensure currentUser has proper defaults
  const currentUser = {
    id: user?.id || 'anonymous',
    name: userPreferences?.name || user?.email?.split('@')[0] || 'Anonymous',
    color: userPreferences?.color || '#6366f1' // Default blue color
  }
  
  const otherCollaborators = collaborators
    .filter(presence => presence.userId !== currentUser.id)
    .map(presence => ({
      id: presence.userId,
      name: presence.userName || 'Anonymous',
      color: presence.color || '#64748b' // Default gray color for collaborators
    }))

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collaboratorDropdownRef.current && !collaboratorDropdownRef.current.contains(event.target as Node)) {
        setIsCollaboratorDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)  }, [])

  const handleEndShare = () => {
    // End sharing functionality - this would depend on your sync implementation
    // For now, we'll show a toast and potentially navigate away or reset the room
    if (confirm('Are you sure you want to end sharing? This will disconnect all collaborators.')) {
      // You might want to implement actual room termination logic here
      // Add toast functionality here if needed
      // Optionally navigate to documents or create a new room
      window.location.href = '/documents'
    }
    setIsCollaboratorDropdownOpen(false)
  }

  const getUserInitials = (name: string) => {
    if (!name || name.trim() === '') return 'A' // Default for empty names
    
    const trimmedName = name.trim()
    const words = trimmedName.split(' ').filter(word => word.length > 0)
    
    if (words.length === 0) return 'A'
    if (words.length === 1) {
      // Single word: take first 2 characters
      return trimmedName.substring(0, 2).toUpperCase()
    } else {
      // Multiple words: take first letter of first two words
      return (words[0][0] + words[1][0]).toUpperCase()
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 16, 
      pointerEvents: 'all',
      paddingTop: 12,
      paddingRight: 16
    }}>
      {/* Collaborator List Component (Left Side) */}
      {otherCollaborators.length > 0 && (
        <div style={{ position: 'relative' }} ref={collaboratorDropdownRef}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 20,
              backgroundColor: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setIsCollaboratorDropdownOpen(!isCollaboratorDropdownOpen)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-border)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-muted)'
            }}
            title="View all collaborators"
          >            {/* Show max 3 collaborator avatars */}
            {otherCollaborators.slice(0, 3).map((collaborator, index) => (
              <div
                key={collaborator.id || index}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: collaborator.color || '#64748b',
                  color: 'white',
                  border: '2px solid var(--color-background)',
                  fontSize: 10,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: index > 0 ? -6 : 0,
                  zIndex: 3 - index,
                  position: 'relative'
                }}
                title={collaborator.name || 'Anonymous'}
              >
                {getUserInitials(collaborator.name || 'Anonymous')}
              </div>
            ))}
            
            {otherCollaborators.length > 3 && (
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--color-text-3)',
                color: 'white',
                border: '2px solid var(--color-background)',
                fontSize: 10,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: -6
              }}>
                +{otherCollaborators.length - 3}
              </div>
            )}
            
            <span style={{ 
              fontSize: 12, 
              color: 'var(--color-text)', 
              marginLeft: 8,
              fontWeight: 500
            }}>
              {otherCollaborators.length} collaborator{otherCollaborators.length > 1 ? 's' : ''}
            </span>
          </div>          {/* Collaborator Dropdown */}
          {isCollaboratorDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 8,
                background: 'var(--color-panel)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minWidth: 200,
                maxWidth: 280,
                zIndex: 1000,
                // Prevent going off screen
                maxHeight: '70vh',
                overflowY: 'auto'
              }}
            >
              {/* Header with title and End Sharing button */}
              <div style={{ 
                padding: '10px 12px', 
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
                  Collaborators ({otherCollaborators.length})
                </div>
                {/* Only show End Sharing for authenticated users (room owners) */}
                {user && (
                  <button
                    style={{
                      padding: '3px 6px',
                      background: 'none',
                      border: '1px solid #ef4444',
                      borderRadius: 3,
                      cursor: 'pointer',
                      fontSize: 10,
                      color: '#ef4444',
                      fontWeight: 500,
                      whiteSpace: 'nowrap'
                    }}
                    onClick={handleEndShare}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none'
                    }}
                    title="End sharing session"
                  >
                    End Share
                  </button>
                )}
              </div>
              
              {/* Compact collaborator list */}
              <div style={{ padding: '4px 0', maxHeight: '200px', overflowY: 'auto' }}>
                {otherCollaborators.map((collaborator, index) => (
                  <div
                    key={collaborator.id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 12px',
                      borderRadius: 0,
                      marginBottom: 0,
                      minHeight: '32px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-muted)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: collaborator.color,
                        color: 'white',
                        fontSize: 9,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {getUserInitials(collaborator.name)}
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: 'var(--color-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {collaborator.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}      {/* User Avatar with Dropdown (Right Side) - Using EditorUserAvatar component */}
      {user && <EditorUserAvatar />}
    </div>
  )
}
