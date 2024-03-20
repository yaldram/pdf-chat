import { useContext } from 'react';

import { ChatContext } from '../contexts/chat';

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context)
    throw new Error('useChatContext must be used within a ChatProvider');

  return context;
};
