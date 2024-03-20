import { Center, Loader, SimpleGrid, ScrollArea } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { fetchPapers } from '../../../../api/papers';
import { PaperCard } from '../../../../components/PaperCard';

export function CollectionPapersPage() {
  const params = useParams();

  const { isPending, data: papers = [] } = useQuery({
    queryKey: [`papers-${params.collectionId}`],
    queryFn: () => fetchPapers(params.collectionId as string),
  });

  if (isPending)
    return (
      <Center h="100%">
        <Loader size="lg" />
      </Center>
    );

  return (
    <ScrollArea py="xl" px="md" h="100%">
      <SimpleGrid spacing="xl" cols={2}>
        {papers.map((paper) => (
          <PaperCard paper={paper} key={paper._id} />
        ))}
      </SimpleGrid>
    </ScrollArea>
  );
}
