
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { AuthDialog } from './AuthDialog'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { PenTool, Menu, X } from 'lucide-react'

export const Header = ({ flat = false }: { flat?: boolean }) => {
	const { user, signOut } = useAuth()
	const [authDialogOpen, setAuthDialogOpen] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const navigate = useNavigate()

	return (
		<>
			<header className={`fixed top-0 left-0 right-0 z-50 ${flat ? 'bg-background/80' : 'bg-background/80'} backdrop-blur-md border-b border-border/40`}>
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					{/* Logo */}
					<div 
						className="flex items-center gap-2 cursor-pointer group transition-all duration-200" 
						onClick={() => navigate('/')}
					>
						<div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
							<PenTool className="h-4 w-4 text-white" />
						</div>
						<span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
							Witepad
						</span>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-6">
						{user && (
							<>
								<Button 
									variant="ghost" 
									size="sm"
									onClick={() => navigate('/documents')}
									className="text-sm font-medium hover:bg-accent"
								>
									Documents
								</Button>
								<Button 
									variant="ghost" 
									size="sm"
									onClick={() => navigate('/editor')}
									className="text-sm font-medium hover:bg-accent"
								>
									New Drawing
								</Button>
							</>
						)}
					</nav>

					{/* Desktop Auth */}
					<div className="hidden md:flex items-center gap-3">
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
										<Avatar className="h-8 w-8">
											<AvatarFallback className="text-xs bg-gradient-to-br from-primary to-purple-600 text-white">
												{user.email?.[0]?.toUpperCase() || 'U'}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuItem onClick={() => navigate('/profile')}>
										Profile
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => navigate('/documents')}>
										My Documents
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => navigate('/settings')}>
										Settings
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={signOut}>
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button 
								size="sm"
								onClick={() => setAuthDialogOpen(true)}
								className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0"
							>
								Get Started
							</Button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="sm"
						className="md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
					</Button>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
						<div className="container mx-auto px-4 py-4 space-y-2">
							{user && (
								<>
									<Button 
										variant="ghost" 
										size="sm"
										onClick={() => {
											navigate('/documents')
											setMobileMenuOpen(false)
										}}
										className="w-full justify-start"
									>
										Documents
									</Button>
									<Button 
										variant="ghost" 
										size="sm"
										onClick={() => {
											navigate('/editor')
											setMobileMenuOpen(false)
										}}
										className="w-full justify-start"
									>
										New Drawing
									</Button>
								</>
							)}
							{user ? (
								<>
									<Button 
										variant="ghost" 
										size="sm"
										onClick={() => {
											navigate('/profile')
											setMobileMenuOpen(false)
										}}
										className="w-full justify-start"
									>
										Profile
									</Button>
									<Button 
										variant="ghost" 
										size="sm"
										onClick={() => {
											navigate('/settings')
											setMobileMenuOpen(false)
										}}
										className="w-full justify-start"
									>
										Settings
									</Button>
									<Button 
										variant="ghost" 
										size="sm"
										onClick={() => {
											signOut()
											setMobileMenuOpen(false)
										}}
										className="w-full justify-start"
									>
										Sign Out
									</Button>
								</>
							) : (
								<Button 
									size="sm"
									onClick={() => {
										setAuthDialogOpen(true)
										setMobileMenuOpen(false)
									}}
									className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white border-0"
								>
									Get Started
								</Button>
							)}
						</div>
					</div>
				)}
			</header>
			<AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
		</>
	)
}
