import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { fetchPaper } from '../../../api/papers';
import { getBulletPoints } from '../../../utils';

export function PapersDetailsPage() {
  const params = useParams();

  const { isPending, data: paper } = useQuery({
    queryKey: ['paper'],
    queryFn: () => fetchPaper(params.paperId as string),
  });

  if (isPending) return <div>Loading...</div>;

  return (
    <ScrollArea h="100%" pl="lg" pr="xl">
      <Stack gap="lg">
        <Stack gap="md">
          <Group gap="xs" align="center">
            <Title order={1}>{paper?.title}</Title>
            <Tooltip label="View Paper" withArrow position="right">
              <ActionIcon
                component={Link}
                to={paper?.fileUrl as string}
                target="_blank"
                size="sm"
                variant="outline"
                aria-label="View Pdf file"
              >
                <IconExternalLink style={{ height: '70%', width: '70%' }} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Title order={2}>{paper?.author}</Title>
        </Stack>

        <Divider />
        <Group>
          {paper?.tags?.map((tag, index) => <Badge key={index}>{tag}</Badge>)}
        </Group>
        <Divider />
        {paper?.summary &&
          getBulletPoints(paper.summary).map((s, index) => (
            <Text size="lg" fw={500}>
              {index + 1}. {s}
            </Text>
          ))}

        <Divider />
        <Title>Summaries</Title>
        {paper?.summaries &&
          paper.summaries.map((summary, index) => (
            <Card key={index} shadow="sm" withBorder>
              <Text size="lg">{summary.summary}</Text>
            </Card>
          ))}
      </Stack>
    </ScrollArea>
  );
}
