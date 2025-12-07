# App Lectura Oración

Aplicación 100% frontend y offline-first para lectura y edición de textos unidad por unidad (oraciones o párrafos).

## Características

- **Offline-first**: Funciona completamente sin internet
- **Persistencia local**: SQLite (sql.js) almacenado en IndexedDB
- **Segmentación inteligente**: Por oraciones o párrafos
- **Lectura enfocada**: Navegación unidad por unidad con modo enfoque
- **Edición y comentarios**: Edita unidades y añade comentarios
- **Arquitectura hexagonal**: Código limpio y mantenible
- **100% accesible**: Navegación completa por teclado

## Instalación

```bash
npm install
```

El archivo WASM de SQLite (`sql-wasm.wasm`) ya está incluido en `public/` y se copiará automáticamente al build. La aplicación funciona completamente offline desde la primera carga.

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Arquitectura

El proyecto sigue una arquitectura hexagonal (Ports & Adapters):

```
src/
  app/              # Bootstrap, routing, contextos
  modules/
    reader/
      domain/       # Entidades y value objects
      application/  # Casos de uso y puertos
      infrastructure/ # Adaptadores (SQLite, IndexedDB)
      ui/           # Componentes React
  shared/           # Utilidades compartidas
```

## Atajos de teclado

### En la pantalla de documento:
- `Ctrl+S`: Guardar
- `Ctrl+Enter`: Iniciar lectura

### En la pantalla de lectura:
- `Enter` o `→`: Siguiente unidad
- `←`: Unidad anterior
- `E`: Editar unidad actual
- `Delete/Backspace`: Eliminar unidad actual
- `Escape`: Cerrar modales

## Tecnologías

- React 18
- TypeScript
- Vite
- sql.js (SQLite en navegador)
- IndexedDB
- React Router

## Licencia

MIT
