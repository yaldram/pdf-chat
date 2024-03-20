import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  rem,
  Stack,
  ScrollArea,
  Divider,
  Title,
} from '@mantine/core';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { Paper } from '../../types';
import { getBulletPoints } from '../../utils';

type PaperCardProps = {
  paper: Paper;
};

function PaperCardComponent({ paper }: PaperCardProps) {
  const { title, author, tags, summary } = paper;

  return (
    <Card h={rem(450)} shadow="sm" py="sm" px="lg" radius="md" withBorder>
      <Stack h="100%" gap="md">
        <Stack gap="xs">
          <Title order={2}>{title}</Title>
          <Text fw={500}>{author}</Text>
          {tags && (
            <Group>
              {tags.map((tag, index) => (
                <Badge key={index} size="md">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>

        <Divider />

        <ScrollArea scrollbarSize={8} pr="xs" h={rem(300)}>
          <Stack>
            {summary &&
              getBulletPoints(summary).map((point, index) => (
                <Text tt="capitalize" key={index} size="lg">
                  {index + 1}. {point}
                </Text>
              ))}
          </Stack>
        </ScrollArea>
        <Divider />
        <Button
          component={Link}
          to={`papers/${paper._id}`}
          size="lg"
          color="blue"
          fullWidth
          radius="md"
        >
          View Details
        </Button>
      </Stack>
    </Card>
  );
}

export const PaperCard = memo(PaperCardComponent);
