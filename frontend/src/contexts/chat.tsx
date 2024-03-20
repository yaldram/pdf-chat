import { createContext, useEffect, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';

import { getChatResponse } from '../api/chat';
import { ChatMessage } from '../types';
import {
  deleteLocalStorageItem,
  getLocalStorageJson,
  setLocalStorageJson,
  getUniqueId,
} from '../utils';

type ChatContext = {
  loading: boolean;
  chatInput: string;
  chatInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  messages: ChatMessage[];
  clearMessages: () => void;
  sendMessage: () => Promise<void>;
};

export const ChatContext = createContext<ChatContext | null>(null);

type ChatProviderProps = {
  children: ReactNode;
  conversationId: string;
  endpoint: string;
  resourceIds?: string[];
};

export const ChatProvider = ({
  children,
  conversationId,
  endpoint,
  resourceIds,
}: ChatProviderProps) => {
  // get a unique id to avoid context length error
  const chatId = getUniqueId(conversationId);

  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const previousMessages = getLocalStorageJson(conversationId);
    return previousMessages || [];
  });

  useEffect(() => {
    return () => {
      setLocalStorageJson(conversationId, messages);
    };
  }, [conversationId, messages]);

  const chatInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChatInput(event.target.value);
  };

  const clearMessages = () => {
    setMessages([]);
    deleteLocalStorageItem(conversationId);
  };

  const sendMessage = async () => {
    setMessages((prevMessages) =>
      prevMessages.concat([{ role: 'user', content: chatInput }]),
    );
    setChatInput('');
    setLoading(true);

    try {
      // Make API call
      const message = await getChatResponse(endpoint, {
        conversationId: chatId,
        resourceId: resourceIds,
        userQuery: chatInput,
      });

      // Handle API response data
      setMessages((prevMessages) =>
        prevMessages.concat([
          {
            role: 'assistant',
            content: message,
          },
        ]),
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    loading,
    chatInput,
    chatInputChange,
    messages,
    clearMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
