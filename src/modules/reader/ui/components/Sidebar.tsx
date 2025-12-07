import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContainer } from '@/app/context/ContainerContext';
import type { Cuaderno } from '../../domain/entities/Cuaderno';

export function Sidebar() {
  const container = useContainer();
  const navigate = useNavigate();
  const [cuadernos, setCuadernos] = useState<Cuaderno[]>([]);
  const [newCuadernoName, setNewCuadernoName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCuadernos();
  }, []);

  const loadCuadernos = async () => {
    const list = await container.useCases.listCuadernos.execute();
    setCuadernos(list);
  };

  const handleCreateCuaderno = async () => {
    if (!newCuadernoName.trim()) return;

    try {
      const cuadernoId = await container.useCases.createCuaderno.execute({
        nombre: newCuadernoName.trim(),
      });
      setNewCuadernoName('');
      setIsCreating(false);
      await loadCuadernos();
      navigate(`/cuaderno/${cuadernoId}`);
    } catch (error) {
      console.error('Error creando cuaderno:', error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Cuadernos</h1>
      </div>

      <div className="sidebar-content">
        <div className="new-cuaderno">
          {isCreating ? (
            <div className="create-form">
              <input
                type="text"
                value={newCuadernoName}
                onChange={(e) => setNewCuadernoName(e.target.value)}
                placeholder="Nombre del cuaderno"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateCuaderno();
                  if (e.key === 'Escape') {
                    setIsCreating(false);
                    setNewCuadernoName('');
                  }
                }}
                autoFocus
              />
              <button onClick={handleCreateCuaderno}>Crear</button>
              <button onClick={() => setIsCreating(false)}>Cancelar</button>
            </div>
          ) : (
            <button
              className="btn-new-cuaderno"
              onClick={() => setIsCreating(true)}
            >
              + Nuevo Cuaderno
            </button>
          )}
        </div>

        <ul className="cuadernos-list">
          {cuadernos.map((cuaderno) => (
            <li key={cuaderno.cuaderno_id}>
              <Link to={`/cuaderno/${cuaderno.cuaderno_id}`}>
                {cuaderno.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
