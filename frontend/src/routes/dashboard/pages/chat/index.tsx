import { Card } from '@mantine/core';

import { ChatMessageList } from '../../../../components/Chat';
import { ChatInputForm } from '../../../../components/ChatInput/ChatInput';
import { ClearChat } from '../../../../components/ClearChat';
import { ChatProvider } from '../../../../contexts/chat';
import { apiEndpoints } from '../../../../lib/apiConfig';
import { DashboardLayout } from '../../layouts';

export function DashboardChatPage() {
  return (
    <DashboardLayout>
      <ChatProvider
        conversationId={'yaldram'}
        endpoint={apiEndpoints.knowledgeBaseChat}
      >
        <Card style={{ position: 'relative' }} radius="lg" h="100%" withBorder>
          <ClearChat />

          <ChatMessageList />

          <ChatInputForm />
        </Card>
      </ChatProvider>
    </DashboardLayout>
  );
}
