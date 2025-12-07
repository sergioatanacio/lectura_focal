-- Nueva arquitectura v2: Cuadernos

-- Tabla de cuadernos
CREATE TABLE IF NOT EXISTS cuadernos (
  cuaderno_id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Tabla de textos originales (inmutables)
CREATE TABLE IF NOT EXISTS textos_originales (
  texto_original_id TEXT PRIMARY KEY,
  cuaderno_id TEXT NOT NULL,
  contenido TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (cuaderno_id) REFERENCES cuadernos(cuaderno_id) ON DELETE CASCADE
);

-- Tabla de textos de lectura (derivados)
CREATE TABLE IF NOT EXISTS textos_de_lectura (
  texto_lectura_id TEXT PRIMARY KEY,
  texto_original_id TEXT NOT NULL,
  modo_segmentacion TEXT NOT NULL,
  nombre TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (texto_original_id) REFERENCES textos_originales(texto_original_id) ON DELETE CASCADE
);

-- Tabla de fragmentos (antes "units")
CREATE TABLE IF NOT EXISTS fragmentos (
  fragmento_id TEXT PRIMARY KEY,
  texto_lectura_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  texto_original TEXT NOT NULL,
  texto_actual TEXT NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (texto_lectura_id) REFERENCES textos_de_lectura(texto_lectura_id) ON DELETE CASCADE
);

-- Tabla de comentarios (actualizada para fragmentos)
CREATE TABLE IF NOT EXISTS comentarios_v2 (
  comment_id TEXT PRIMARY KEY,
  fragmento_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (fragmento_id) REFERENCES fragmentos(fragmento_id) ON DELETE CASCADE
);

-- Estado de lectura (actualizado)
CREATE TABLE IF NOT EXISTS estado_lectura (
  texto_lectura_id TEXT PRIMARY KEY,
  current_position INTEGER NOT NULL,
  focus_mode INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (texto_lectura_id) REFERENCES textos_de_lectura(texto_lectura_id) ON DELETE CASCADE
);

-- Update schema version
UPDATE schema_version SET version = 3;
