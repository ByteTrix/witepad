
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
			<header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800/50">
				<div className="container mx-auto px-4 h-20 flex items-center justify-between">
					{/* Logo */}
					<div 
						className="flex items-center gap-3 cursor-pointer group transition-all duration-300" 
						onClick={() => navigate('/')}
					>
						<div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
							<PenTool className="h-5 w-5 text-white" />
						</div>
						<span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent">
							Witepad
						</span>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						{user && (
							<>
								<Button 
									variant="ghost" 
									size="sm"
									onClick={() => navigate('/documents')}
									className="text-white hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200"
								>
									Documents
								</Button>
								<Button 
									variant="ghost" 
									size="sm"
									onClick={() => navigate('/editor')}
									className="text-white hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200"
								>
									New Drawing
								</Button>
							</>
						)}
					</nav>

					{/* Desktop Auth */}
					<div className="hidden md:flex items-center gap-4">
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform">
										<Avatar className="h-10 w-10">
											<AvatarFallback className="text-sm bg-gradient-to-br from-purple-600 to-cyan-600 text-white">
												{user.email?.[0]?.toUpperCase() || 'U'}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-gray-800">
									<DropdownMenuItem onClick={() => navigate('/profile')} className="text-white hover:bg-purple-500/10">
										Profile
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => navigate('/documents')} className="text-white hover:bg-purple-500/10">
										My Documents
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => navigate('/settings')} className="text-white hover:bg-purple-500/10">
										Settings
									</DropdownMenuItem>
									<DropdownMenuSeparator className="bg-gray-800" />
									<DropdownMenuItem onClick={signOut} className="text-white hover:bg-red-500/10">
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button 
								size="sm"
								onClick={() => setAuthDialogOpen(true)}
								className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border-0 px-6 py-2 rounded-full hover:scale-105 transition-all duration-200"
							>
								Get Started
							</Button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="sm"
						className="md:hidden text-white hover:bg-purple-500/10"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-xl">
						<div className="container mx-auto px-4 py-6 space-y-4">
							{user && (
								<>
									<Button 
										variant="ghost" 
										size="sm"
										onClick={() => {
											navigate('/documents')
											setMobileMenuOpen(false)
										}}
										className="w-full justify-start text-white hover:bg-purple-500/10"
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
										className="w-full justify-start text-white hover:bg-cyan-500/10"
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
										className="w-full justify-start text-white hover:bg-purple-500/10"
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
										className="w-full justify-start text-white hover:bg-purple-500/10"
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
										className="w-full justify-start text-white hover:bg-red-500/10"
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
									className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border-0 rounded-full"
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
