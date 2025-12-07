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

  const handleDownloadDB = async () => {
    try {
      const data = await container.dbAdapter.exportBytes();
      const blob = new Blob([data as BlobPart], {
        type: 'application/octet-stream',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lectura-oracion-${Date.now()}.db`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando BD:', error);
      alert('Error al descargar la base de datos');
    }
  };

  const handleUploadDB = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.db';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await container.dbAdapter.importBytes(uint8Array);
        alert('Base de datos cargada exitosamente. Recargando página...');
        window.location.reload();
      } catch (error) {
        console.error('Error cargando BD:', error);
        alert('Error al cargar la base de datos');
      }
    };
    input.click();
  };

  const handleResetDB = async () => {
    const confirmMessage =
      '⚠️ ADVERTENCIA: Esta acción eliminará TODA la base de datos y todos los textos guardados.\n\n' +
      'Esta acción NO se puede deshacer.\n\n' +
      '¿Estás seguro de que quieres continuar?';

    if (!confirm(confirmMessage)) return;

    const doubleConfirm = confirm(
      '⚠️ ÚLTIMA CONFIRMACIÓN\n\n' +
        'Se eliminarán permanentemente:\n' +
        '- Todos los cuadernos\n' +
        '- Todos los textos de lectura\n' +
        '- Todos los comentarios\n' +
        '- Todo el progreso de lectura\n\n' +
        '¿Realmente deseas eliminar TODO?'
    );

    if (!doubleConfirm) return;

    try {
      await container.dbAdapter.reset();
      alert('Base de datos eliminada exitosamente. Recargando página...');
      window.location.reload();
    } catch (error) {
      console.error('Error reseteando BD:', error);
      alert('Error al resetear la base de datos');
    }
  };

  const handleDeleteCuaderno = async (
    e: React.MouseEvent,
    cuadernoId: string,
    nombreCuaderno: string
  ) => {
    e.preventDefault(); // Evitar navegación
    e.stopPropagation();

    const confirmMessage = `¿Estás seguro de que quieres eliminar el cuaderno "${nombreCuaderno}"?\n\nEsto eliminará:\n- El cuaderno\n- Todos los textos originales\n- Todos los textos de lectura\n- Todos los fragmentos y comentarios\n- Todo el progreso de lectura\n\nEsta acción NO se puede deshacer.`;

    if (!confirm(confirmMessage)) return;

    try {
      await container.useCases.deleteCuaderno.execute(cuadernoId);
      await loadCuadernos();
      // Navegar a la página principal si estábamos viendo el cuaderno eliminado
      navigate('/');
    } catch (error) {
      console.error('Error eliminando cuaderno:', error);
      alert('Error al eliminar el cuaderno');
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
            <li key={cuaderno.cuaderno_id} className="cuaderno-item">
              <Link
                to={`/cuaderno/${cuaderno.cuaderno_id}`}
                className="cuaderno-link"
              >
                {cuaderno.nombre}
              </Link>
              <button
                className="btn-delete-cuaderno"
                onClick={(e) =>
                  handleDeleteCuaderno(e, cuaderno.cuaderno_id, cuaderno.nombre)
                }
                title="Eliminar cuaderno"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <h3>Gestión de Base de Datos</h3>
          <div className="db-actions">
            <button onClick={handleDownloadDB} title="Descargar base de datos">
              ⬇️ Descargar
            </button>
            <button onClick={handleUploadDB} title="Cargar base de datos">
              ⬆️ Cargar
            </button>
            <button
              onClick={handleResetDB}
              className="btn-danger"
              title="Eliminar toda la base de datos"
            >
              🗑️ Resetear
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
