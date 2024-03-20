import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { appRouter } from './routes';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications position="top-center" zIndex={1000} />
        <RouterProvider router={appRouter} />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
