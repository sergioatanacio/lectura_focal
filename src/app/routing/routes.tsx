import { createBrowserRouter } from 'react-router-dom';
import { DocumentPage } from '@/modules/reader/ui/pages/DocumentPage';
import { ReadingPage } from '@/modules/reader/ui/pages/ReadingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DocumentPage />,
  },
  {
    path: '/reading/:documentId',
    element: <ReadingPage />,
  },
]);
