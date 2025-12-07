import { createHashRouter } from 'react-router-dom';
import { DocumentPage } from '@/modules/reader/ui/pages/DocumentPage';
import { ReadingPage } from '@/modules/reader/ui/pages/ReadingPage';
import { AppLayout } from '@/modules/reader/ui/components/AppLayout';
import { BibliotecaPage } from '@/modules/reader/ui/pages/BibliotecaPage';
import { CuadernoPage } from '@/modules/reader/ui/pages/CuadernoPage';
import { LecturaPage } from '@/modules/reader/ui/pages/LecturaPage';

// Usamos HashRouter para compatibilidad offline-first y file://
export const router = createHashRouter([
  // v2 routes with sidebar layout
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <BibliotecaPage />,
      },
      {
        path: 'cuaderno/:cuadernoId',
        element: <CuadernoPage />,
      },
      {
        path: 'lectura/:textoLecturaId',
        element: <LecturaPage />,
      },
    ],
  },
  // Legacy v1 routes (without sidebar)
  {
    path: '/v1',
    element: <DocumentPage />,
  },
  {
    path: '/v1/reading/:documentId',
    element: <ReadingPage />,
  },
]);
