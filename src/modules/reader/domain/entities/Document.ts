export interface Document {
  document_id: string;
  title?: string;
  raw_text: string;
  created_at: number;
  updated_at: number;
}

export function createDocument(params: {
  document_id: string;
  title?: string;
  raw_text: string;
}): Document {
  const now = Date.now();
  return {
    document_id: params.document_id,
    title: params.title,
    raw_text: params.raw_text,
    created_at: now,
    updated_at: now,
  };
}
