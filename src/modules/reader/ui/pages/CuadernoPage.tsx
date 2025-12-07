import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContainer } from '@/app/context/ContainerContext';
import type { TextoLecturaListItem } from '../../application/usecases/ListTextosDeLectura';

export function CuadernoPage() {
  const { cuadernoId } = useParams<{ cuadernoId: string }>();
  const container = useContainer();
  const navigate = useNavigate();
  const [textosDeLectura, setTextosDeLectura] = useState<
    TextoLecturaListItem[]
  >([]);
  const [newTexto, setNewTexto] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'ORACION' | 'PARRAFO'>(
    'ORACION'
  );

  useEffect(() => {
    if (cuadernoId) {
      loadTextosDeLectura();
    }
  }, [cuadernoId]);

  const loadTextosDeLectura = async () => {
    if (!cuadernoId) return;
    const list = await container.useCases.listTextosDeLectura.execute(
      cuadernoId
    );
    setTextosDeLectura(list);
  };

  const handleCreateTexto = async () => {
    if (!cuadernoId || !newTexto.trim()) return;

    try {
      // Crear texto original
      const textoOriginalId =
        await container.useCases.createTextoOriginal.execute({
          cuadernoId,
          contenido: newTexto,
        });

      // Crear texto de lectura
      const textoLecturaId =
        await container.useCases.createTextoDeLectura.execute({
          textoOriginalId,
          modoSegmentacion: selectedMode,
        });

      setNewTexto('');
      setIsCreating(false);
      await loadTextosDeLectura();

      // Navegar al modo de lectura
      navigate(`/lectura/${textoLecturaId}`);
    } catch (error) {
      console.error('Error creando texto:', error);
    }
  };

  return (
    <div className="cuaderno-page">
      <h2>Cuaderno</h2>

      <div className="new-texto-section">
        {isCreating ? (
          <div className="create-texto-form">
            <textarea
              value={newTexto}
              onChange={(e) => setNewTexto(e.target.value)}
              placeholder="Escribe o pega el texto aquí..."
              rows={10}
              autoFocus
            />
            <div className="mode-selector">
              <label>
                <input
                  type="radio"
                  value="ORACION"
                  checked={selectedMode === 'ORACION'}
                  onChange={(e) =>
                    setSelectedMode(e.target.value as 'ORACION' | 'PARRAFO')
                  }
                />
                Por oración
              </label>
              <label>
                <input
                  type="radio"
                  value="PARRAFO"
                  checked={selectedMode === 'PARRAFO'}
                  onChange={(e) =>
                    setSelectedMode(e.target.value as 'ORACION' | 'PARRAFO')
                  }
                />
                Por párrafo
              </label>
            </div>
            <div className="form-actions">
              <button onClick={handleCreateTexto}>Crear y Leer</button>
              <button onClick={() => setIsCreating(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <button className="btn-new-texto" onClick={() => setIsCreating(true)}>
            + Nuevo Texto
          </button>
        )}
      </div>

      <div className="textos-lectura-list">
        <h3>Textos de Lectura</h3>
        {textosDeLectura.length === 0 ? (
          <p>No hay textos de lectura aún.</p>
        ) : (
          <ul>
            {textosDeLectura.map((texto) => (
              <li key={texto.texto_lectura_id}>
                <button
                  onClick={() => navigate(`/lectura/${texto.texto_lectura_id}`)}
                >
                  {texto.nombre || `Texto (${texto.modo_segmentacion})`}
                  <span className="text-meta">
                    {new Date(texto.created_at).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
