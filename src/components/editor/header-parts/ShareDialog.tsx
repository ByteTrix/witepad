
import {
    useToasts,
    TldrawUiDialogHeader,
    TldrawUiDialogTitle,
    TldrawUiDialogCloseButton,
    TldrawUiDialogBody,
    TldrawUiDialogFooter,
    TldrawUiButton,
    TldrawUiButtonLabel,
  } from 'tldraw'

// Custom dialog component for sharing functionality
export function ShareDialog({ onClose, documentId }: { onClose: () => void; documentId?: string }) {
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
