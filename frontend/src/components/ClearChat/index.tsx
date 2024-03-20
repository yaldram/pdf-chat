import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

import { useChatContext } from '../../hooks/chat';

export function ClearChat() {
  const { clearMessages } = useChatContext();

  return (
    <ActionIcon
      mt="xs"
      onClick={clearMessages}
      style={{ position: 'absolute', zIndex: 10, top: 0 }}
    >
      <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
  );
}
