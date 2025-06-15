import {
  useToasts,
  useDialogs,
  useEditor,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
  TldrawUiDialogCloseButton,
  TldrawUiDialogBody,
  TldrawUiDialogFooter,
  TldrawUiButton,
  TldrawUiButtonLabel,
} from 'tldraw'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { UserAvatar } from '@/components/UserAvatar'
import { useDocuments } from '@/hooks/useDocuments'

// Editor-themed UserAvatar component that matches the editor UI styling
const EditorUserAvatar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  if (!user) return null

  const userInitials = user.email?.substring(0, 2).toUpperCase() || 'U'
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          color: 'black',
          border: '2px solid var(--color-background)',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          outline: 'none'
        }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
        title={displayName}
      >
        {user.user_metadata?.avatar_url ? (
          <img 
            src={user.user_metadata.avatar_url} 
            alt={displayName}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          userInitials
        )}
      </button>

      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            background: 'var(--color-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            minWidth: 200,
            zIndex: 1000
          }}
        >
          <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid var(--color-border)' 
          }}>
            <div style={{ 
              fontSize: 14, 
              fontWeight: 500, 
              color: 'var(--color-text)' 
            }}>
              {displayName}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: 'var(--color-text-3)',
              marginTop: '2px'
            }}>
              {user.email}
            </div>
          </div>
          
          <div style={{ padding: '4px 0' }}>
            <button
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--color-text)',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => {
                navigate('/documents')
                setIsDropdownOpen(false)
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-muted)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
              </svg>
              My Documents
            </button>
            
            <button
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--color-text)',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => {
                navigate('/profile')
                setIsDropdownOpen(false)
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-muted)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile
            </button>
            
            <button
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--color-text)',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => {
                navigate('/settings')
                setIsDropdownOpen(false)
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-muted)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </button>
            
            <div style={{ 
              height: '1px', 
              background: 'var(--color-border)', 
              margin: '4px 0' 
            }} />
            
            <button
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--color-text)',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => {
                handleSignOut()
                setIsDropdownOpen(false)
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-muted)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

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
        gap: 12,
        padding: '8px 20px', // Increased padding
        borderRadius: 12, // Increased border radius
        backgroundColor: 'var(--color-panel)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        minHeight: '44px' // Ensure consistent height
      }}>
        <div style={{ position: 'relative' }}>
          <img 
            src="/witepad-logo.png" 
            alt="Witepad" 
            style={{ 
              height: 32, // Slightly larger
              width: 32,
              borderRadius: 3
            }} 
          />
          {/* Connection status indicator - only when offline */}
          {!isOnline && (
            <div style={{
              position: 'absolute',
              top: -3,
              right: -3,
              width: 8,
              height: 8,
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
            fontSize: 16, // Keep same size
            letterSpacing: '-0.01em'
          }}        >
          Witepad
        </span>
      </div>
    </div>
  )
}

// Custom dialog component for editing user name
function EditNameDialog({ onClose, currentName, onNameChange }: { 
  onClose: () => void
  currentName: string
  onNameChange: (name: string) => void
}) {
  const { addToast } = useToasts()
  const [newName, setNewName] = useState(currentName)

  const handleSave = () => {
    if (newName.trim()) {
      onNameChange(newName.trim())
      addToast({ title: 'Name updated successfully!', severity: 'success' })
      onClose()
    } else {
      addToast({ title: 'Name cannot be empty', severity: 'error' })
    }
  }

  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Edit Your Name</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody style={{ maxWidth: 350 }}>
        <p style={{ marginBottom: 12 }}>Change how your name appears to other collaborators:</p>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text)',
            fontSize: 14
          }}
          placeholder="Enter your name"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave()
            }
          }}
        />
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter className="tlui-dialog__footer__actions">
        <TldrawUiButton type="normal" onClick={onClose}>
          <TldrawUiButtonLabel>Cancel</TldrawUiButtonLabel>
        </TldrawUiButton>
        <TldrawUiButton type="primary" onClick={handleSave}>
          <TldrawUiButtonLabel>Save</TldrawUiButtonLabel>
        </TldrawUiButton>      </TldrawUiDialogFooter>
    </>
  )
}

// Custom dialog component for sharing functionality
function ShareDialog({ onClose, documentId }: { onClose: () => void; documentId?: string }) {
  const { addToast } = useToasts()

  const generateRoomLink = () => {
    const baseUrl = window.location.origin
    const roomId = documentId || 'default-room'
    return `${baseUrl}/editor?roomId=${roomId}`
  }

  const handleCopyLink = () => {
    const roomLink = generateRoomLink()
    navigator.clipboard.writeText(roomLink)
    addToast({ title: 'Room link copied to clipboard!', severity: 'success' })
    onClose()
  }

  const roomLink = generateRoomLink()

  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Share Drawing</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody style={{ maxWidth: 400 }}>
        <p style={{ marginBottom: 12 }}>Share this drawing room with others by copying the link below:</p>
        <div style={{ 
          marginTop: 12, 
          padding: 12, 
          backgroundColor: 'var(--color-muted)', 
          borderRadius: 6,
          fontSize: 12,
          wordBreak: 'break-all',
          fontFamily: 'monospace',
          border: '1px solid var(--color-border)'
        }}>
          {roomLink}
        </div>
        <p style={{ 
          marginTop: 12, 
          fontSize: 11, 
          color: 'var(--color-text-3)',
          lineHeight: 1.4
        }}>
          Anyone with this link can join this drawing room and collaborate in real-time.
        </p>
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter className="tlui-dialog__footer__actions">
        <TldrawUiButton type="normal" onClick={onClose}>
          <TldrawUiButtonLabel>Cancel</TldrawUiButtonLabel>
        </TldrawUiButton>
        <TldrawUiButton type="primary" onClick={handleCopyLink}>
          <TldrawUiButtonLabel>Copy Link</TldrawUiButtonLabel>
        </TldrawUiButton>
      </TldrawUiDialogFooter>
    </>
  )
}

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
