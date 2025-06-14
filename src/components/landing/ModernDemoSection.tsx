
import { createContext, useContext, useState } from 'react'
import { Editor, Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

// Context for managing focused editor
const focusedEditorContext = createContext(
	{} as {
		focusedEditor: Editor | null
		setFocusedEditor(id: Editor | null): void
	}
)

function blurEditor(editor: Editor) {
	editor.blur({ blurContainer: false })
	editor.selectNone()
	editor.setCurrentTool('hand')
}

export const ModernDemoSection = () => {
  const [focusedEditor, setFocusedEditor] = useState<Editor | null>(null)

  return (
    <section className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              See It In Action
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the power of collaborative whiteboarding with our live demo
            </p>
          </div>

          {/* TLDraw Demo with TrueFocus effect */}
          <focusedEditorContext.Provider value={{ focusedEditor, setFocusedEditor }}>
            <div 
              className="max-w-4xl mx-auto"
              onPointerDown={() => {
                if (!focusedEditor) return
                blurEditor(focusedEditor)
                setFocusedEditor(null)
              }}
            >
              <div className="relative group">
                {/* TrueFocus spotlight overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Shape blur glow */}
                <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <InlineBlock persistenceKey="demo-whiteboard" />
                </div>
              </div>
            </div>
          </focusedEditorContext.Provider>

          {/* Demo features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'Draw & Sketch', desc: 'Create beautiful diagrams with intuitive tools' },
              { title: 'Real-time Sync', desc: 'See changes instantly across all devices' },
              { title: 'Infinite Canvas', desc: 'Never run out of space for your ideas' }
            ].map((item, index) => (
              <div key={index} className="space-y-4 group cursor-pointer">
                <h3 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function InlineBlock({ persistenceKey }: { persistenceKey: string }) {
	const { focusedEditor, setFocusedEditor } = useContext(focusedEditorContext)
	const [editor, setEditor] = useState<Editor>()

	return (
		<div
			className="w-full h-96 md:h-[500px] rounded-3xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-500"
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
