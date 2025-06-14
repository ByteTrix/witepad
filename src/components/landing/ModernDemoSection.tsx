
import { useState, useContext, createContext } from 'react'
import { Editor, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { Button } from '@/components/ui/button'
import { Play, Maximize2 } from 'lucide-react'

const focusedEditorContext = createContext(
  {} as {
    focusedEditor: Editor | null
    setFocusedEditor(editor: Editor | null): void
  }
)

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
      {/* Spotlight Effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.1), transparent 70%)`
          }}
        />
      )}
      {children}
    </div>
  )
}

function InlineEditor({ persistenceKey }: { persistenceKey: string }) {
  const { focusedEditor, setFocusedEditor } = useContext(focusedEditorContext)
  const [editor, setEditor] = useState<Editor>()

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
      }}
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

  return (
    <section id="demo" className="py-32 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-900/10 via-transparent to-cyan-900/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of real-time collaboration with our interactive whiteboard
            </p>
          </div>

          {/* Interactive Demo */}
          <TrueFocus className="group">
            <focusedEditorContext.Provider value={{ focusedEditor, setFocusedEditor }}>
              <div 
                className="relative bg-gradient-to-br from-gray-900 to-black border border-cyan-400/20 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-cyan-400/20 transition-all duration-500"
                onPointerDown={() => {
                  if (!focusedEditor) return
                  blurEditor(focusedEditor)
                  setFocusedEditor(null)
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
                  <InlineEditor persistenceKey="demo-canvas" />
                </div>

                {/* Floating Instructions */}
                <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-4 max-w-sm">
                  <p className="text-sm text-gray-300">
                    <span className="text-cyan-400 font-semibold">Try it out!</span> Click and drag to draw, use tools to create shapes, and experience real-time collaboration.
                  </p>
                </div>
              </div>
            </focusedEditorContext.Provider>
          </TrueFocus>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { title: "Real-time Sync", description: "See changes instantly across all connected devices" },
              { title: "Infinite Canvas", description: "Draw without boundaries on an unlimited workspace" },
              { title: "Professional Tools", description: "Complete set of drawing and annotation tools" }
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
