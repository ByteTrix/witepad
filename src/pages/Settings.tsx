import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Moon, Sun, Monitor } from 'lucide-react'

const Settings = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { 
    theme, 
    setTheme, 
    animationsEnabled, 
    setAnimationsEnabled,
    defaultZoom,
    setDefaultZoom,
    showGrid,
    setShowGrid,
    snapToGrid,
    setSnapToGrid,
    autoSave,
    setAutoSave
  } = useTheme()
  
  // State to display zoom value in UI
  const [zoomDisplay, setZoomDisplay] = useState(defaultZoom)

  // Handle zoom slider change
  const handleZoomChange = (value: number[]) => {
    setZoomDisplay(value[0])
    setDefaultZoom(value[0])
  }

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <Tabs defaultValue="appearance">
          <TabsList className="mb-8">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="mb-4">                    <h3 className="font-medium mb-2">Theme</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        className={`flex flex-col items-center justify-center gap-2 h-auto p-4 ${theme === 'light' ? 'border-primary' : ''}`}
                        onClick={() => setTheme('light')}
                      >
                        <Sun className="h-5 w-5" />
                        <span>Light</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className={`flex flex-col items-center justify-center gap-2 h-auto p-4 ${theme === 'dark' ? 'border-primary' : ''}`}
                        onClick={() => setTheme('dark')}
                      >
                        <Moon className="h-5 w-5" />
                        <span>Dark</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className={`flex flex-col items-center justify-center gap-2 h-auto p-4 ${theme === 'system' ? 'border-primary' : ''}`}
                        onClick={() => setTheme('system')}
                      >
                        <Monitor className="h-5 w-5" />
                        <span>System</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Interface Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable animations throughout the interface
                      </p>
                    </div>
                    <Switch 
                      id="animations" 
                      checked={animationsEnabled}
                      onCheckedChange={setAnimationsEnabled}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>                      <div className="flex items-center justify-between">
                        <Label htmlFor="zoom">Default Zoom Level</Label>
                        <span className="text-sm text-muted-foreground">{zoomDisplay}%</span>
                      </div>
                      <Slider 
                        value={[defaultZoom]} 
                        max={200} 
                        min={50} 
                        step={5} 
                        id="zoom" 
                        className="mt-2"
                        onValueChange={handleZoomChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="editor">
            <Card>
              <CardHeader>
                <CardTitle>Editor Settings</CardTitle>
                <CardDescription>
                  Customize your drawing and editing experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">                    <Label htmlFor="grid">Show Grid</Label>
                    <p className="text-sm text-muted-foreground">
                      Display a grid to help with alignment
                    </p>
                  </div>
                  <Switch 
                    id="grid" 
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">                    <Label htmlFor="snap">Snap to Grid</Label>
                    <p className="text-sm text-muted-foreground">
                      Elements will snap to the grid when moved
                    </p>
                  </div>
                  <Switch 
                    id="snap" 
                    checked={snapToGrid}
                    onCheckedChange={setSnapToGrid}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">                    <Label htmlFor="autosave">Auto-Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes as you work
                    </p>
                  </div>
                  <Switch 
                    id="autosave" 
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium">Account Created</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Settings
