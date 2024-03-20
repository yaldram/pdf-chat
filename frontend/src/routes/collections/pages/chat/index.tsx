import { Card } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { fetchCollection } from '../../../../api/collections';
import { ChatMessageList } from '../../../../components/Chat';
import { ChatInputForm } from '../../../../components/ChatInput/ChatInput';
import { ClearChat } from '../../../../components/ClearChat';
import { ChatProvider } from '../../../../contexts/chat';
import { apiEndpoints } from '../../../../lib/apiConfig';

export function CollectionChatPage() {
  const params = useParams();

  const collectionId = params.collectionId as string;

  const { data: collection } = useQuery({
    queryKey: [`collections-${collectionId}`],
    queryFn: () => fetchCollection(collectionId),
  });

  return (
    <ChatProvider
      conversationId={collectionId}
      endpoint={apiEndpoints.collectionChat}
      resourceIds={collection?.paperIds}
    >
      <Card style={{ position: 'relative' }} radius="lg" h="100%" withBorder>
        <ClearChat />

        <ChatMessageList />

        <ChatInputForm />
      </Card>
    </ChatProvider>
  );
}
