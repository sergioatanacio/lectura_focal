import { generateId } from '@/shared/domain/ids';
import { ValidationError } from '@/shared/application/errors';
import { createComment } from '../../domain/entities/Comment';
import type { CommentRepositoryPort } from '../ports/CommentRepositoryPort';

export class AddComment {
  constructor(private commentRepo: CommentRepositoryPort) {}

  async execute(unitId: string, text: string): Promise<string> {
    if (!text || text.trim().length === 0) {
      throw new ValidationError('El comentario no puede estar vacío');
    }

    const commentId = generateId();
    const comment = createComment({
      comment_id: commentId,
      unit_id: unitId,
      text: text.trim(),
    });

    await this.commentRepo.save(comment);
    return commentId;
  }
}
