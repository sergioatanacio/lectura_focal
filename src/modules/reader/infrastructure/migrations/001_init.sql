-- Schema version table
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER NOT NULL
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  document_id TEXT PRIMARY KEY,
  title TEXT,
  raw_text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Units table
CREATE TABLE IF NOT EXISTS units (
  unit_id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  mode TEXT NOT NULL,
  original_text TEXT NOT NULL,
  current_text TEXT NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (document_id) REFERENCES documents(document_id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  comment_id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE CASCADE
);

-- Reading state table
CREATE TABLE IF NOT EXISTS reading_state (
  document_id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,
  current_position INTEGER NOT NULL,
  focus_mode INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (document_id) REFERENCES documents(document_id) ON DELETE CASCADE
);

-- Insert initial schema version
INSERT INTO schema_version (version) VALUES (1);
