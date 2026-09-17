import { IMediaRepository } from '../repositories/IMediaRepository';
import { IWishRepository } from '../repositories/IWishRepository';
import { NotFoundError } from '../../domain/errors/DomainError';

export class ModerationService {
  constructor(
    private mediaRepo: IMediaRepository,
    private wishRepo: IWishRepository
  ) {}

  public async getMediaComments(mediaId: string, organizerId?: string) {
    const comments = await this.mediaRepo.findCommentsScoped(mediaId, organizerId);
    return comments;
  }

  public async updateCommentStatus(commentId: string, status: string, organizerId?: string) {
    const updated = await this.mediaRepo.updateCommentStatusScoped(commentId, status, organizerId);
    if (!updated) {
      throw new NotFoundError('MediaComment (or unauthorized tenant access)', commentId);
    }
    return { success: true };
  }

  public async updateWishStatus(wishId: string, status: string, organizerId?: string) {
    const updated = await this.wishRepo.updateStatusScoped(wishId, status, organizerId);
    if (!updated) {
      throw new NotFoundError('Wish (or unauthorized tenant access)', wishId);
    }
    return { success: true };
  }

  public async deleteWish(wishId: string, organizerId?: string) {
    const deleted = await this.wishRepo.deleteScoped(wishId, organizerId);
    if (!deleted) {
      throw new NotFoundError('Wish (or unauthorized tenant access)', wishId);
    }
    return { success: true };
  }

  public async updateMediaStatus(mediaId: string, status: string, organizerId?: string) {
    const updated = await this.mediaRepo.updateStatusScoped(mediaId, status, organizerId);
    if (!updated) {
      throw new NotFoundError('MediaAsset (or unauthorized tenant access)', mediaId);
    }
    return { success: true };
  }

  public async deleteMedia(mediaId: string, organizerId?: string) {
    const deleted = await this.mediaRepo.deleteScoped(mediaId, organizerId);
    if (!deleted) {
      throw new NotFoundError('MediaAsset (or unauthorized tenant access)', mediaId);
    }
    return { success: true };
  }
}
