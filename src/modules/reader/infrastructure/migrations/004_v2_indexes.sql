-- Índices para v2

-- Cuadernos
CREATE INDEX IF NOT EXISTS idx_cuadernos_created
  ON cuadernos(created_at DESC);

-- Textos originales por cuaderno
CREATE INDEX IF NOT EXISTS idx_textos_originales_cuaderno
  ON textos_originales(cuaderno_id);

-- Textos de lectura por texto original
CREATE INDEX IF NOT EXISTS idx_textos_lectura_original
  ON textos_de_lectura(texto_original_id);

-- Fragmentos por texto de lectura y posición
CREATE INDEX IF NOT EXISTS idx_fragmentos_lectura_position
  ON fragmentos(texto_lectura_id, position);

-- Comentarios por fragmento
CREATE INDEX IF NOT EXISTS idx_comentarios_v2_fragmento
  ON comentarios_v2(fragmento_id, created_at);

-- Update schema version
UPDATE schema_version SET version = 4;
