
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
import { useState } from 'react'

// Custom dialog component for editing user name
export function EditNameDialog({ onClose, currentName, onNameChange }: { 
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
        </TldrawUiButton>      
      </TldrawUiDialogFooter>
    </>
  )
}
