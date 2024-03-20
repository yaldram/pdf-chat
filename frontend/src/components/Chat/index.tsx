import { Flex, Paper, ScrollArea, Text } from '@mantine/core';
import { useEffect, useRef } from 'react';

import { useChatContext } from '../../hooks/chat';

export function ChatMessageList() {
  const { messages } = useChatContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  };

  useEffect(() => {
    // Scroll to the latest message when 'messages' change
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea style={{ flexBasis: '90%', overflow: 'scroll' }}>
      <Flex p="lg" direction="column" gap="lg">
        {messages.map((item, index) => {
          const isUser = item.role === 'user';
          const bgColor = isUser ? '#d1d1d1' : '#a3cff0';

          return (
            <Flex
              ref={index === messages.length - 1 ? messagesEndRef : null}
              key={index}
              justify={isUser ? 'flex-end' : 'flex-start'}
            >
              <Paper radius="md" p="lg" m={5} bg={bgColor} maw="80%">
                <Text
                  size="lg"
                  style={{ textAlign: isUser ? 'right' : 'left' }}
                >
                  {item.content}
                </Text>
              </Paper>
            </Flex>
          );
        })}
      </Flex>
    </ScrollArea>
  );
}
