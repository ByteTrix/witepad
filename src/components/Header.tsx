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

export const Header = ({ flat = false }: { flat?: boolean }) => {
		const { user, signOut } = useAuth()
		const [authDialogOpen, setAuthDialogOpen] = useState(false)
		const navigate = useNavigate()

		return (
			<div className={`w-full flex justify-between items-center px-4 ${flat ? 'mt-0 bg-background border-b border-border/40 rounded-none shadow-none' : 'mt-6'}`}>
				{/* Left pill: Logo and Witepad */}
				<div className={`${flat ? 'bg-transparent border-none shadow-none' : 'bg-neutral-900/90 rounded-full shadow border border-neutral-800'} flex items-center gap-2 px-4 py-1 cursor-pointer transition-all duration-200 hover:shadow-lg`} onClick={() => navigate('/')}> 
					<img src="/placeholder.svg" alt="Logo" className="h-7 w-7" />
					<span className="text-white font-semibold text-base">Witepad</span>
				</div>
				{/* Right pill: Profile or Sign In */}
				<div className={`${flat ? 'bg-transparent border-none shadow-none' : 'bg-neutral-900/90 rounded-full shadow border border-neutral-800'} flex items-center gap-2 px-4 py-1 transition-all duration-200 hover:shadow-lg`}>
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar className="cursor-pointer h-8 w-8">
									<AvatarFallback>{user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
								<DropdownMenuItem onClick={() => navigate('/documents')}>My Documents</DropdownMenuItem>
								<DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant="outline" size="sm" className="h-8 px-4 py-1" onClick={() => setAuthDialogOpen(true)}>
							Sign In
						</Button>
					)}
				</div>
				<AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
			</div>
		)
}
