import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useContainer } from '@/app/context/ContainerContext';
import type { Cuaderno } from '../../domain/entities/Cuaderno';
import type { TextoLecturaListItem } from '../../application/usecases/ListTextosDeLectura';

export function CuadernoPage() {
  const { cuadernoId } = useParams<{ cuadernoId: string }>();
  const container = useContainer();
  const navigate = useNavigate();
  const location = useLocation();
  const [cuaderno, setCuaderno] = useState<Cuaderno | null>(null);
  const [textosDeLectura, setTextosDeLectura] = useState<
    TextoLecturaListItem[]
  >([]);
  const [newTexto, setNewTexto] = useState('');
  const [newNombreTexto, setNewNombreTexto] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'ORACION' | 'PARRAFO'>(
    'ORACION'
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (cuadernoId) {
      loadCuaderno();
      loadTextosDeLectura();
    }
  }, [cuadernoId, location.pathname]);

  const loadCuaderno = async () => {
    if (!cuadernoId) return;
    const cuadernosList = await container.useCases.listCuadernos.execute();
    const found = cuadernosList.find((c) => c.cuaderno_id === cuadernoId);
    if (found) {
      setCuaderno(found);
    }
  };

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
          nombre: newNombreTexto.trim() || undefined,
        });

      setNewTexto('');
      setNewNombreTexto('');
      setIsCreating(false);
      await loadTextosDeLectura();

      // Navegar al modo de lectura
      navigate(`/lectura/${textoLecturaId}`);
    } catch (error) {
      console.error('Error creando texto:', error);
    }
  };

  const handleEditName = () => {
    if (cuaderno) {
      setEditedName(cuaderno.nombre);
      setIsEditingName(true);
    }
  };

  const handleSaveName = async () => {
    if (!cuadernoId || !editedName.trim()) return;

    try {
      await container.useCases.updateCuaderno.execute({
        cuadernoId,
        nombre: editedName.trim(),
      });
      await loadCuaderno();
      setIsEditingName(false);
    } catch (error) {
      console.error('Error actualizando nombre:', error);
    }
  };

  return (
    <div className="cuaderno-page">
      <div className="cuaderno-header">
        {isEditingName ? (
          <div className="edit-name-form">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') setIsEditingName(false);
              }}
              autoFocus
            />
            <button onClick={handleSaveName}>Guardar</button>
            <button onClick={() => setIsEditingName(false)}>Cancelar</button>
          </div>
        ) : (
          <h2>
            {cuaderno?.nombre || 'Cuaderno'}
            <button className="btn-edit-inline" onClick={handleEditName}>
              ✏️
            </button>
          </h2>
        )}
      </div>

      <div className="new-texto-section">
        {isCreating ? (
          <div className="create-texto-form">
            <input
              type="text"
              value={newNombreTexto}
              onChange={(e) => setNewNombreTexto(e.target.value)}
              placeholder="Nombre del texto (opcional)"
            />
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
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewTexto('');
                  setNewNombreTexto('');
                }}
              >
                Cancelar
              </button>
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
