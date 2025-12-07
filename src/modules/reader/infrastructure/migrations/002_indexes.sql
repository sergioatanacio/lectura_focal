-- Indexes for performance

-- Units: lookup by document, mode, and position
CREATE INDEX IF NOT EXISTS idx_units_document_mode_position
  ON units(document_id, mode, position);

-- Units: lookup by document
CREATE INDEX IF NOT EXISTS idx_units_document
  ON units(document_id);

-- Comments: lookup by unit and creation time
CREATE INDEX IF NOT EXISTS idx_comments_unit_created
  ON comments(unit_id, created_at);

-- Update schema version
UPDATE schema_version SET version = 2;
