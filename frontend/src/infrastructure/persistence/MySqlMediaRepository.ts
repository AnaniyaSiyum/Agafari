import { IMediaRepository, MediaAsset, MediaComment } from '../../application/repositories/IMediaRepository';
import { query, queryOne } from '../../lib/db';
import { mockStore } from '../../lib/mockData';

export class MySqlMediaRepository implements IMediaRepository {
  private isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public async findByEventId(eventId: string, category?: string): Promise<MediaAsset[]> {
    try {
      let sql = 'SELECT * FROM media_assets WHERE event_id = $1';
      const params: any[] = [eventId];
      if (category) {
        sql += ' AND category = $2';
        params.push(category);
      }
      sql += ' ORDER BY created_at DESC';
      const rows = await query(sql, params);
      return rows as MediaAsset[];
    } catch (err) {
      if (!this.isDev()) throw err;
    }
    if (this.isDev()) {
      return mockStore.mediaAssets.filter(
        (m) => m.eventId === eventId && (!category || (m as any).category === category)
      ) as any[];
    }
    return [];
  }

  // Part B Finding 2.3: Scoped to organizerId at SQL level
  public async findByOrganizerId(organizerId: string): Promise<MediaAsset[]> {
    try {
      const rows = await query(
        `SELECT m.* FROM media_assets m
         JOIN events e ON m.event_id = e.id
         WHERE e.organizer_id = $1 OR e.organizer_id = $2
         ORDER BY m.created_at DESC`,
        [organizerId, organizerId.replace(/^org-/, '')]
      );
      return rows as MediaAsset[];
    } catch (err) {
      if (!this.isDev()) throw err;
    }
    if (this.isDev()) {
      return mockStore.mediaAssets as any[];
    }
    return [];
  }

  // Part B Finding 2.3: Scoped media status update
  public async updateStatusScoped(mediaId: string, status: string, organizerId?: string): Promise<boolean> {
    try {
      if (organizerId) {
        const rawOrgId = organizerId.replace(/^org-/, '');
        await query(
          `UPDATE media_assets SET status = $1
           WHERE id = $2 AND event_id IN (
             SELECT id FROM events WHERE organizer_id = $3 OR organizer_id = $4 OR $3 = 'SYSTEM_ADMIN'
           )`,
          [status, mediaId, organizerId, rawOrgId]
        );
        return true;
      } else {
        await query('UPDATE media_assets SET status = $1 WHERE id = $2', [status, mediaId]);
        return true;
      }
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const media = mockStore.mediaAssets.find((m) => m.id === mediaId);
      if (media) media.status = status as any;
      return true;
    }
    return false;
  }

  // Part B Finding 2.3: Scoped media deletion
  public async deleteScoped(mediaId: string, organizerId?: string): Promise<boolean> {
    try {
      if (organizerId) {
        const rawOrgId = organizerId.replace(/^org-/, '');
        await query(
          `DELETE FROM media_assets
           WHERE id = $1 AND event_id IN (
             SELECT id FROM events WHERE organizer_id = $2 OR organizer_id = $3 OR $2 = 'SYSTEM_ADMIN'
           )`,
          [mediaId, organizerId, rawOrgId]
        );
        return true;
      } else {
        await query('DELETE FROM media_assets WHERE id = $1', [mediaId]);
        return true;
      }
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const idx = mockStore.mediaAssets.findIndex((m) => m.id === mediaId);
      if (idx >= 0) mockStore.mediaAssets.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Part B Finding 2.3: Scoped media comment fetching
  public async findCommentsScoped(mediaId: string, organizerId?: string): Promise<MediaComment[]> {
    try {
      if (organizerId) {
        const rawOrgId = organizerId.replace(/^org-/, '');
        const rows = await query(
          `SELECT c.* FROM media_comments c
           JOIN media_assets m ON c.media_asset_id = m.id
           JOIN events e ON m.event_id = e.id
           WHERE c.media_asset_id = $1 AND (e.organizer_id = $2 OR e.organizer_id = $3 OR $2 = 'SYSTEM_ADMIN')
           ORDER BY c.created_at ASC`,
          [mediaId, organizerId, rawOrgId]
        );
        return rows as MediaComment[];
      } else {
        const rows = await query('SELECT * FROM media_comments WHERE media_asset_id = $1 ORDER BY created_at ASC', [mediaId]);
        return rows as MediaComment[];
      }
    } catch (err) {
      if (!this.isDev()) throw err;
    }
    return [];
  }

  // Part B Finding 2.3: Scoped comment status update
  public async updateCommentStatusScoped(commentId: string, status: string, organizerId?: string): Promise<boolean> {
    try {
      if (organizerId) {
        const rawOrgId = organizerId.replace(/^org-/, '');
        await query(
          `UPDATE media_comments SET status = $1
           WHERE id = $2 AND media_asset_id IN (
             SELECT m.id FROM media_assets m
             JOIN events e ON m.event_id = e.id
             WHERE e.organizer_id = $3 OR e.organizer_id = $4 OR $3 = 'SYSTEM_ADMIN'
           )`,
          [status, commentId, organizerId, rawOrgId]
        );
        return true;
      } else {
        await query('UPDATE media_comments SET status = $1 WHERE id = $2', [status, commentId]);
        return true;
      }
    } catch (err) {
      if (!this.isDev()) throw err;
    }
    return false;
  }

  public async createCommentScoped(mediaId: string, authorName: string, commentText: string): Promise<MediaComment> {
    const id = `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const comment: MediaComment = {
      id,
      mediaAssetId: mediaId,
      authorName: authorName.trim(),
      commentText: commentText.trim(),
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    };

    try {
      await query(
        `INSERT INTO media_comments (id, media_asset_id, author_name, comment_text, status)
         VALUES ($1,$2,$3,$4,$5)`,
        [comment.id, comment.mediaAssetId, comment.authorName, comment.commentText, comment.status]
      );
    } catch (err) {
      if (!this.isDev()) throw err;
    }
    return comment;
  }
}
