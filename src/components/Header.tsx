import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AuthDialog } from './AuthDialog';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ClickSpark } from '@/components/landing/ClickSpark';
export const Header = ({
  flat = false
}: {
  flat?: boolean;
}) => {
  const {
    user
  } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [{
    label: 'Home',
    href: '/'
  }, {
    label: 'Features',
    href: '#features'
  }, {
    label: 'Demo',
    href: '#demo'
  }, {
    label: 'Testimonials',
    href: '#testimonials'
  }];
  return <>
      {/* Modern floating glass navbar */}
      <nav className="fixed left-1/2 top-4 z-[99] -translate-x-1/2 w-[98vw] max-w-5xl rounded-2xl shadow-2xl bg-black/85 ring-2 ring-cyan-400/15 backdrop-blur-2xl px-4 py-1.5 flex items-center justify-between transition-all border border-cyan-400/10 gap-2">
        {/* Logo/brand */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform overflow-hidden">
            <img alt="Witepad Logo" className="w-full h-full object-contain" src="/lovable-uploads/59fcbac7-1227-4191-92a6-2eb429a470ac.png" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-orange-400 via-white to-orange-400 bg-clip-text text-transparent tracking-tight select-none">
            Witepad
          </span>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex gap-6">
            {navItems.map(item => {
            const isAnchor = item.href.startsWith('#');
            const isActive = isAnchor ? location.hash === item.href : location.pathname === item.href && location.hash === '';
            return <li key={item.label}>
                  {isAnchor ? <a href={item.href} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${isActive ? 'text-cyan-300' : 'text-gray-300 hover:text-white'}`}>
                      {item.label}
                    </a> : <Link to={item.href} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${isActive ? 'text-cyan-300' : 'text-gray-300 hover:text-white'}`}>
                      {item.label}
                    </Link>}
                </li>;
          })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {!user && <ClickSpark>
              <Button size="sm" className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black px-4 py-1 rounded-full shadow-lg hover:scale-105 transition-all text-sm font-bold" onClick={() => setAuthDialogOpen(true)}>
                Get Started
              </Button>
            </ClickSpark>}
        </div>
      </nav>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <div className="h-16" /> {/* Spacer for floating nav */}
    </>;
};