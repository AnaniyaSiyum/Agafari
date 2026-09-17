import { IWishRepository, Wish } from '../../application/repositories/IWishRepository';
import { query, queryOne } from '../../lib/db';
import { mockStore } from '../../lib/mockData';

export class MySqlWishRepository implements IWishRepository {
  private isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public async findByEventId(eventId: string): Promise<Wish[]> {
    try {
      const rows = await query('SELECT * FROM wishes WHERE event_id = $1 ORDER BY created_at DESC', [eventId]);
      return rows as Wish[];
    } catch (err) {
      if (!this.isDev()) throw err;
    }
    if (this.isDev()) {
      return mockStore.wishes.filter((w) => w.eventId === eventId) as any[];
    }
    return [];
  }

  // Part B Finding 2.3: Scoped to organizerId
  public async findByOrganizerId(organizerId: string): Promise<Wish[]> {
    try {
      const rows = await query(
        `SELECT w.* FROM wishes w
         JOIN events e ON w.event_id = e.id
         WHERE e.organizer_id = $1 OR e.organizer_id = $2
         ORDER BY w.created_at DESC`,
        [organizerId, organizerId.replace(/^org-/, '')]
      );
      return rows as Wish[];
    } catch (err) {
      if (!this.isDev()) throw err;
    }
    if (this.isDev()) {
      return mockStore.wishes as any[];
    }
    return [];
  }

  // Part B Finding 2.3: Scoped update at SQL level
  public async updateStatusScoped(wishId: string, status: string, organizerId?: string): Promise<boolean> {
    try {
      if (organizerId) {
        const rawOrgId = organizerId.replace(/^org-/, '');
        const res = await query(
          `UPDATE wishes SET status = $1
           WHERE id = $2 AND event_id IN (
             SELECT id FROM events WHERE organizer_id = $3 OR organizer_id = $4 OR $3 = 'SYSTEM_ADMIN'
           )`,
          [status, wishId, organizerId, rawOrgId]
        );
        return true;
      } else {
        await query('UPDATE wishes SET status = $1 WHERE id = $2', [status, wishId]);
        return true;
      }
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const wish = mockStore.wishes.find((w) => w.id === wishId);
      if (wish) wish.status = status as any;
      return true;
    }
    return false;
  }

  // Part B Finding 2.3: Scoped delete at SQL level
  public async deleteScoped(wishId: string, organizerId?: string): Promise<boolean> {
    try {
      if (organizerId) {
        const rawOrgId = organizerId.replace(/^org-/, '');
        await query(
          `DELETE FROM wishes
           WHERE id = $1 AND event_id IN (
             SELECT id FROM events WHERE organizer_id = $2 OR organizer_id = $3 OR $2 = 'SYSTEM_ADMIN'
           )`,
          [wishId, organizerId, rawOrgId]
        );
        return true;
      } else {
        await query('DELETE FROM wishes WHERE id = $1', [wishId]);
        return true;
      }
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const idx = mockStore.wishes.findIndex((w) => w.id === wishId);
      if (idx >= 0) mockStore.wishes.splice(idx, 1);
      return true;
    }
    return false;
  }

  public async create(wish: Partial<Wish>): Promise<Wish> {
    const id = wish.id || `wish_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newWish: Wish = {
      id,
      eventId: wish.eventId!,
      senderName: wish.senderName || 'Anonymous',
      message: wish.message || '',
      mediaType: wish.mediaType || 'TEXT',
      videoUrl: wish.videoUrl,
      status: wish.status || 'PENDING',
      createdAt: wish.createdAt || new Date().toISOString(),
    };

    try {
      await query(
        `INSERT INTO wishes (id, event_id, sender_name, message, media_type, video_url, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [newWish.id, newWish.eventId, newWish.senderName, newWish.message, newWish.mediaType, newWish.videoUrl ?? null, newWish.status]
      );
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      mockStore.wishes.unshift(newWish as any);
    }
    return newWish;
  }
}
