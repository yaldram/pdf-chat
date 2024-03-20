import { Box, Flex } from '@mantine/core';
import { Outlet } from 'react-router-dom';

import {
  SegmentedNav,
  SegmentedNavRoutes,
} from '../../components/SegmentedNav';

const papersRoutes: SegmentedNavRoutes[] = [
  {
    to: '',
    label: 'Details',
    end: true,
  },
  {
    to: 'chat',
    label: 'Chat',
  },
];

export default function PapersPage() {
  return (
    <Flex p="lg" direction="column" gap="md" h="100%" w="100%">
      <Box>
        <SegmentedNav routes={papersRoutes} />
      </Box>

      <Box style={{ overflow: 'hidden' }} h="95%" pb="lg">
        <Outlet />
      </Box>
    </Flex>
  );
}
