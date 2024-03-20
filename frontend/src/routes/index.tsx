import { createBrowserRouter } from 'react-router-dom';

import CollectionPage from './collections';
import { CollectionChatPage } from './collections/pages/chat';
import { CollectionPapersPage } from './collections/pages/papers';
import DashboardPage from './dashboard';
import { DashboardChatPage } from './dashboard/pages/chat';
import { DashboardHomePage } from './dashboard/pages/home';
import LoginPage from './login';
import PapersPage from './papers';
import { PapersChatPage } from './papers/chat';
import { PapersDetailsPage } from './papers/details';
import RegisterPage from './register';

export const appRouter = createBrowserRouter([
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <DashboardPage />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: 'chat',
        element: <DashboardChatPage />,
      },
      {
        path: '/collections/:collectionId',
        element: <CollectionPage />,
        children: [
          {
            index: true,
            element: <CollectionPapersPage />,
          },
          {
            path: 'chat',
            element: <CollectionChatPage />,
          },
        ],
      },
      {
        path: '/collections/:collectionId/papers/:paperId',
        element: <PapersPage />,
        children: [
          {
            index: true,
            element: <PapersDetailsPage />,
          },
          {
            path: 'chat',
            element: <PapersChatPage />,
          },
        ],
      },
    ],
  },
]);
