import { Card } from '@mantine/core';
import { useParams } from 'react-router-dom';

import { ChatMessageList } from '../../../components/Chat';
import { ChatInputForm } from '../../../components/ChatInput/ChatInput';
import { ClearChat } from '../../../components/ClearChat';
import { ChatProvider } from '../../../contexts/chat';
import { apiEndpoints } from '../../../lib/apiConfig';

export function PapersChatPage() {
  const params = useParams();
  const paperId = params.paperId as string;

  return (
    <ChatProvider
      conversationId={paperId}
      endpoint={apiEndpoints.paperChat}
      resourceIds={[paperId]}
    >
      <Card style={{ position: 'relative' }} radius="lg" h="100%" withBorder>
        <ClearChat />

        <ChatMessageList />

        <ChatInputForm />
      </Card>
    </ChatProvider>
  );
}
