import type { Comment } from '../../domain/entities/Comment';
import type { CommentRepositoryPort } from '../ports/CommentRepositoryPort';

export class ListComments {
  constructor(private commentRepo: CommentRepositoryPort) {}

  async execute(unitId: string): Promise<Comment[]> {
    return await this.commentRepo.findByUnit(unitId);
  }
}
