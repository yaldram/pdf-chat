import { Button, Flex, TextInput } from '@mantine/core';
import { IconCircle, IconSend } from '@tabler/icons-react';
import { useRef, type FormEvent, useEffect } from 'react';
import { Form } from 'react-router-dom';

import { useChatContext } from '../../hooks/chat';

export function ChatInputForm() {
  const { chatInput, chatInputChange, sendMessage, loading } = useChatContext();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (loading) return;
    inputRef.current?.focus();
  }, [loading]);

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendMessage();
  };

  return (
    <Form onSubmit={handleOnSubmit}>
      <Flex w="100%" p="md" align="center" gap="md">
        <TextInput
          ref={inputRef}
          id="message"
          placeholder="Type your message..."
          size="lg"
          flex={1}
          autoComplete="off"
          disabled={loading}
          value={chatInput}
          onChange={chatInputChange}
        />
        <Button
          type="submit"
          disabled={chatInput.length === 0 || loading}
          size="lg"
          leftSection={
            loading ? (
              <IconCircle className="h-4 w-4" />
            ) : (
              <IconSend className="h-4 w-4" />
            )
          }
        >
          <span className="sr-only">Send</span>
        </Button>
      </Flex>
    </Form>
  );
}
