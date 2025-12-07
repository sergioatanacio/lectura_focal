import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routing/routes';
import { ContainerProvider } from './context/ContainerContext';
import { initDatabase } from './bootstrap/initDatabase';
import { buildContainer, type Container } from './bootstrap/buildContainer';
import './index.css';

function App() {
  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('Inicializando...');

  useEffect(() => {
    async function initialize() {
      try {
        setProgress('Inicializando base de datos local...');
        setProgress('- Abriendo IndexedDB');
        setProgress('- Cargando sql.js');

        const dbAdapter = await initDatabase((msg) => setProgress(msg));

        setProgress('- Aplicando migraciones (básicas)');

        const appContainer = buildContainer(dbAdapter);
        setContainer(appContainer);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    }

    initialize();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        <h1 style={{ marginBottom: '2rem' }}>App Lectura Oración</h1>
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <p style={{ marginBottom: '1rem' }}>{progress}</p>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: '50%',
                backgroundColor: '#007bff',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        <h1 style={{ marginBottom: '2rem' }}>App Lectura Oración</h1>
        <div
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <h2>ERROR: No se pudo abrir la base de datos local.</h2>
          <p>{error}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!container) {
    return null;
  }

  return (
    <ContainerProvider container={container}>
      <RouterProvider router={router} />
    </ContainerProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
