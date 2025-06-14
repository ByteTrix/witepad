
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
import { PenTool } from 'lucide-react'
import GooeyNav from '@/blocks/Components/GooeyNav/GooeyNav'

export const Header = ({ flat = false }: { flat?: boolean }) => {
	const { user, signOut } = useAuth()
	const [authDialogOpen, setAuthDialogOpen] = useState(false)
	const navigate = useNavigate()

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Features', href: '#features' },
		{ label: 'Demo', href: '#demo' },
		{ label: 'Testimonials', href: '#testimonials' }
	]

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-cyan-500/20">
				<div className="container mx-auto px-6 h-20 flex items-center justify-between">
					{/* Logo */}
					<div 
						className="flex items-center gap-3 cursor-pointer group transition-all duration-300" 
						onClick={() => navigate('/')}
					>
						<div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-cyan-400/25">
							<PenTool className="h-5 w-5 text-black" />
						</div>
						<span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
							Witepad
						</span>
					</div>

					{/* Desktop Navigation with GooeyNav */}
					<nav className="hidden md:block">
						<GooeyNav 
							items={navItems}
							colors={[1, 2, 3, 4]}
							initialActiveIndex={0}
						/>
					</nav>

					{/* Desktop Auth */}
					<div className="hidden md:flex items-center gap-4">
						{user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform">
										<Avatar className="h-10 w-10 border-2 border-cyan-400/50">
											<AvatarFallback className="text-sm bg-gradient-to-br from-cyan-400 to-purple-500 text-black font-bold">
												{user.email?.[0]?.toUpperCase() || 'U'}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56 bg-black/95 backdrop-blur-xl border-cyan-400/20">
									<DropdownMenuItem onClick={() => navigate('/profile')} className="text-white hover:bg-cyan-400/10 hover:text-cyan-400">
										Profile
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => navigate('/documents')} className="text-white hover:bg-cyan-400/10 hover:text-cyan-400">
										My Documents
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => navigate('/settings')} className="text-white hover:bg-cyan-400/10 hover:text-cyan-400">
										Settings
									</DropdownMenuItem>
									<DropdownMenuSeparator className="bg-gray-800" />
									<DropdownMenuItem onClick={signOut} className="text-white hover:bg-red-500/10 hover:text-red-400">
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Button 
								size="sm"
								onClick={() => setAuthDialogOpen(true)}
								className="relative bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-black border-0 px-8 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-400/25"
							>
								<span className="relative z-10">Get Started</span>
								<div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-purple-400 rounded-full blur opacity-0 hover:opacity-50 transition-opacity duration-300" />
							</Button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="sm"
						className="md:hidden text-white hover:bg-cyan-400/10 hover:text-cyan-400 border border-cyan-400/30 rounded-lg"
						onClick={() => setAuthDialogOpen(true)}
					>
						Menu
					</Button>
				</div>
			</header>
			<AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
		</>
	)
}
