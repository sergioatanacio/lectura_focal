export interface Comment {
  comment_id: string;
  unit_id: string;
  text: string;
  created_at: number;
}

export function createComment(params: {
  comment_id: string;
  unit_id: string;
  text: string;
}): Comment {
  return {
    comment_id: params.comment_id,
    unit_id: params.unit_id,
    text: params.text,
    created_at: Date.now(),
  };
}
