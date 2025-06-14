import React, { useState, useContext, createContext } from 'react'
import { Editor, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { Button } from '@/components/ui/button'
import { Maximize2 } from 'lucide-react'

const focusedEditorContext = createContext(
  {} as {
    focusedEditor: Editor | null
    setFocusedEditor(editor: Editor | null): void
  }
)

// Remove tip after click/focus
function blurEditor(editor: Editor) {
  editor.blur({ blurContainer: false })
  editor.selectNone()
  editor.setCurrentTool('hand')
}

const TrueFocus = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }
  return (
    <div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight effect disabled for clarity */}
      {children}
    </div>
  )
}

function InlineEditor({ persistenceKey, onFirstFocus }: { persistenceKey: string, onFirstFocus: () => void }) {
  const { focusedEditor, setFocusedEditor } = useContext(focusedEditorContext)
  const [editor, setEditor] = useState<Editor>()
  const [hasFocused, setHasFocused] = useState(false)

  return (
    <div
      className="w-full h-96 rounded-2xl overflow-hidden border border-cyan-400/20 bg-black"
      onFocus={() => {
        if (!editor) return
        if (focusedEditor && focusedEditor !== editor) {
          blurEditor(focusedEditor)
        }
        editor.focus({ focusContainer: false })
        setFocusedEditor(editor)
        // Hide tip on FIRST FOCUS
        if (!hasFocused) {
          setHasFocused(true)
          onFirstFocus()
        }
      }}
      // Hide tip also when user clicks (i.e., any pointer interaction)
      onPointerDown={() => {
        if (!hasFocused) {
          setHasFocused(true)
          onFirstFocus()
        }
      }}
      tabIndex={0}
    >
      <Tldraw
        persistenceKey={persistenceKey}
        autoFocus={false}
        hideUi={focusedEditor !== editor}
        options={{
          maxPages: 0,
          edgeScrollSpeed: 0,
        }}
        components={{
          HelpMenu: null,
          NavigationPanel: null,
          MainMenu: null,
        }}
        onMount={(editor) => {
          setEditor(editor)
          editor.setCurrentTool('hand')
        }}
      />
    </div>
  )
}

export const ModernDemoSection = () => {
  const [focusedEditor, setFocusedEditor] = useState<Editor | null>(null)
  const [showTip, setShowTip] = useState(true)

  return (
    <section id="demo" className="py-32 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience real-time collaboration now.
            </p>
          </div>
          <TrueFocus className="group">
            <focusedEditorContext.Provider value={{ focusedEditor, setFocusedEditor }}>
              <div
                className="relative bg-gradient-to-br from-gray-900 to-black border border-cyan-400/20 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-cyan-400/20 transition-all duration-500"
                onPointerDown={() => {
                  if (!focusedEditor) return
                  blurEditor(focusedEditor)
                  setFocusedEditor(null)
                  setShowTip(false) // Hide the tip on any canvas click!
                }}
              >
                {/* Browser Bar */}
                <div className="flex items-center gap-2 p-4 bg-gray-900/80 border-b border-cyan-400/20 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-gray-400 bg-black/50 rounded-lg px-4 py-1 inline-block border border-cyan-400/20">
                      witepad.app/demo
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
                {/* TLDraw Canvas */}
                <div className="p-6 bg-gradient-to-br from-gray-900/50 to-black">
                  <InlineEditor persistenceKey="demo-canvas" onFirstFocus={() => setShowTip(false)} />
                </div>
                {/* Tip only if not dismissed */}
                {showTip && (
                  <div className="absolute bottom-6 left-6 bg-black/85 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-4 max-w-sm pointer-events-none transition-opacity duration-500">
                    <p className="text-sm text-gray-300">
                      <span className="text-cyan-400 font-semibold">Try it out!</span>{" "}
                      Click and drag to draw, use tools, and see real-time sync. This tip will disappear after you start editing.
                    </p>
                  </div>
                )}
              </div>
            </focusedEditorContext.Provider>
          </TrueFocus>
          {/* Features highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { title: "Real-time Sync", description: "See changes instantly on all screens" },
              { title: "Infinite Canvas", description: "No boundaries—just ideas" },
              { title: "Secure & Fast", description: "Private, encrypted, blazing fast" }
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-3 p-6 rounded-2xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm hover:border-cyan-400/30 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
