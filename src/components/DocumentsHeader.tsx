
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import { Plus, Loader2 } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';

export const DocumentsHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createDocument } = useDocuments();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDocument = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const doc = await createDocument('Untitled Drawing');
      if (doc) {
        navigate(`/editor/${doc.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo/brand */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform overflow-hidden">
            <img alt="Witepad Logo" className="w-full h-full object-contain" src="/witepad-logo.png" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-orange-400 via-foreground to-orange-400 bg-clip-text text-transparent tracking-tight select-none">
            Witepad
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleCreateDocument}
            disabled={isCreating}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-black"
          >
            {isCreating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            New Document
          </Button>
          {user && <UserAvatar />}
        </div>
      </div>
    </header>
  );
};
