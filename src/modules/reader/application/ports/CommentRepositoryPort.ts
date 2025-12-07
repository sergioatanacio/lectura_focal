import type { Comment } from '../../domain/entities/Comment';

export interface CommentRepositoryPort {
  save(comment: Comment): Promise<void>;
  findById(commentId: string): Promise<Comment | null>;
  findByUnit(unitId: string): Promise<Comment[]>;
  delete(commentId: string): Promise<void>;
}
