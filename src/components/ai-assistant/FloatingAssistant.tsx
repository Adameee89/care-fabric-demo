import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import FloatingChatButton from './FloatingChatButton';
import FloatingChatPanel from './FloatingChatPanel';

/**
 * Floating AI Assistant - shows on all authenticated pages except AI assistant pages
 */
const FloatingAssistant = memo(() => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Hide on AI assistant pages (both public and authenticated)
  const isAIPage = location.pathname === '/ai' || location.pathname === '/ai-assistant';
  
  // Only show for authenticated users and not on AI pages
  if (!isAuthenticated || isAIPage) {
    return null;
  }
  
  return (
    <>
      <FloatingChatButton />
      <FloatingChatPanel />
    </>
  );
});

FloatingAssistant.displayName = 'FloatingAssistant';

export default FloatingAssistant;
