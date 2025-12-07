import { createHashRouter } from 'react-router-dom';
import { DocumentPage } from '@/modules/reader/ui/pages/DocumentPage';
import { ReadingPage } from '@/modules/reader/ui/pages/ReadingPage';

// Usamos HashRouter para compatibilidad offline-first y file://
export const router = createHashRouter([
  {
    path: '/',
    element: <DocumentPage />,
  },
  {
    path: '/reading/:documentId',
    element: <ReadingPage />,
  },
]);
