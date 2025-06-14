
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
		{ label: 'Documents', href: '/documents' },
		{ label: 'Editor', href: '/editor' },
	]

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/30">
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

					{/* Desktop Navigation with GooeyNav */}
					<div className="hidden md:block">
						{user && <GooeyNav items={navItems} />}
					</div>

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
				</div>
			</header>
			<AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
		</>
	)
}
