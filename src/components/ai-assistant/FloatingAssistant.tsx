import { memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FloatingChatButton from './FloatingChatButton';
import FloatingChatPanel from './FloatingChatPanel';

/**
 * Floating AI Assistant - shows on all authenticated pages
 */
const FloatingAssistant = memo(() => {
  const { isAuthenticated } = useAuth();
  
  // Only show for authenticated users
  if (!isAuthenticated) {
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
