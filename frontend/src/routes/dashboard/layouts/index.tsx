import { Box, Stack } from '@mantine/core';
import type { ReactNode } from 'react';

import {
  SegmentedNav,
  SegmentedNavRoutes,
} from '../../../components/SegmentedNav';

type TabsLayoutProps = {
  children?: ReactNode;
};

const dashboardRoutes: SegmentedNavRoutes[] = [
  {
    to: '/',
    label: 'Home',
  },
  {
    to: '/chat',
    label: 'Chat',
  },
];

export function DashboardLayout({ children }: TabsLayoutProps) {
  return (
    <Stack w="100%" h="100%" p="lg" pb={0} gap="lg">
      <SegmentedNav routes={dashboardRoutes} />

      <Box w="100%" h="85%">
        {children}
      </Box>
    </Stack>
  );
}
