
import { Header } from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { AuthDialog } from '@/components/AuthDialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Palette, Zap, Users, Cloud, ArrowRight, Sparkles, Shield, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDocuments } from '@/hooks/useDocuments'

const Index = () => {
  const { user, isLoading } = useAuth()
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const navigate = useNavigate();
  const { createDocument } = useDocuments()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading Witepad...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Now with AI-powered features
                </Badge>
                <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent leading-tight">
                  Create. Collaborate.
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Draw Better.
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  The modern collaborative drawing platform built for teams who want to bring their ideas to life with powerful tools and seamless collaboration.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  onClick={() => setAuthDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  Start Drawing Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setAuthDialogOpen(true)}
                  className="text-lg px-8 py-6 h-auto rounded-xl border-2 hover:bg-accent/50 transition-all duration-200"
                >
                  View Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-12 space-y-4">
                <p className="text-sm text-muted-foreground">Trusted by creative teams worldwide</p>
                <div className="flex justify-center items-center gap-8 opacity-50">
                  <div className="text-sm font-medium">10k+ Users</div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <div className="text-sm font-medium">50+ Countries</div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <div className="text-sm font-medium">99% Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary" className="mb-4">Features</Badge>
                <h2 className="text-3xl md:text-5xl font-bold">Everything you need to create</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Professional-grade tools with the simplicity your team deserves
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Palette,
                    title: "Advanced Drawing Tools",
                    description: "Professional drawing tools with layers, custom brushes, and vector graphics support for detailed artwork.",
                    gradient: "from-pink-500 to-rose-500"
                  },
                  {
                    icon: Users,
                    title: "Real-time Collaboration",
                    description: "Work together seamlessly with live cursors, instant updates, and team member presence indicators.",
                    gradient: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: Cloud,
                    title: "Cloud Storage",
                    description: "Automatic saving and syncing across all devices with version history and backup protection.",
                    gradient: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description: "Optimized performance with instant loading and smooth 60fps drawing experience.",
                    gradient: "from-yellow-500 to-orange-500"
                  },
                  {
                    icon: Shield,
                    title: "Enterprise Security",
                    description: "Bank-level encryption, SSO support, and compliance with industry security standards.",
                    gradient: "from-purple-500 to-indigo-500"
                  },
                  {
                    icon: Globe,
                    title: "Global Access",
                    description: "Access your work from anywhere with offline support and global CDN distribution.",
                    gradient: "from-teal-500 to-green-500"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
                    <CardContent className="p-8 space-y-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold">Ready to start creating?</h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands of creators who are already using Witepad to bring their ideas to life.
                </p>
              </div>
              
              <Card className="p-8 bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20">
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Start for free today</h3>
                    <p className="text-muted-foreground">
                      No credit card required. Create unlimited drawings and collaborate with up to 3 team members.
                    </p>
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => setAuthDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <AuthDialog 
          open={authDialogOpen} 
          onOpenChange={setAuthDialogOpen} 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="pt-20 h-screen">
        <div className="container mx-auto p-6">
          <div className="flex flex-col items-center justify-center gap-8 pt-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome back to Witepad
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Continue creating and collaborating on beautiful diagrams and sketches
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                size="lg"
                onClick={() => navigate('/documents')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-xl"
              >
                My Documents
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {
                  const createAndNavigate = async () => {
                    const doc = await createDocument('Untitled Drawing')
                    if (doc) {
                      navigate(`/editor/${doc.id}`)
                    }
                  }
                  createAndNavigate()
                }}
                className="rounded-xl border-2"
              >
                New Document
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
