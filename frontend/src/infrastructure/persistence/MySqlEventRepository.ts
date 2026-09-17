import { IEventRepository } from '../../application/repositories/IEventRepository';
import { Event, EventProps } from '../../domain/entities/Event';
import { query, queryOne } from '../../lib/db';
import { mockStore } from '../../lib/mockData';

export class MySqlEventRepository implements IEventRepository {
  private isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  private mapToDomain(row: any): Event {
    const brideName = row.bride_name || row.brideName || '';
    const groomName = row.groom_name || row.groomName || '';
    
    const props: EventProps = {
      id: row.id,
      slug: row.slug,
      title: row.title || (brideName && groomName ? `${brideName} & ${groomName}'s Wedding` : 'Wedding Event'),
      managedBy: row.managed_by || row.managedBy || (row.organizer_id ? 'ORGANIZER' : 'ADMIN'),
      organizerId: row.organizer_id || row.organizerId || null,
      coupleUserId: row.couple_user_id || row.coupleUserId || null,
      templateId: row.template_id || row.templateId || null,
      templateCustomizationJson: row.template_customization_json || row.templateCustomizationJson || null,
      brideName,
      groomName,
      eventDate: row.event_date || row.eventDate || new Date().toISOString(),
      venueName: row.venue_name || row.venueName || '',
      venueAddress: row.venue_address || row.venueAddress || null,
      dressCode: row.dress_code || row.dressCode || null,
      status: row.status || 'COMING_SOON',
      adminApprovalStatus: row.admin_approval_status || row.adminApprovalStatus || 'APPROVED',
      isLive: Boolean(row.is_live ?? row.isLive ?? false),
    };

    return new Event(props);
  }

  public async findBySlug(slug: string): Promise<Event | null> {
    try {
      const row = await queryOne('SELECT * FROM events WHERE slug = $1', [slug]);
      if (row) return this.mapToDomain(row);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const found = mockStore.events.find((e) => e.slug === slug);
      if (found) return this.mapToDomain(found);
    }
    return null;
  }

  public async findById(id: string): Promise<Event | null> {
    try {
      const row = await queryOne('SELECT * FROM events WHERE id = $1', [id]);
      if (row) return this.mapToDomain(row);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const found = mockStore.events.find((e) => e.id === id);
      if (found) return this.mapToDomain(found);
    }
    return null;
  }

  // Part B Finding 2.2: Single query with JOIN & GROUP BY / Batched counts to resolve N+1 correlated subqueries
  public async findAll(): Promise<Event[]> {
    try {
      const rows = await query(`
        SELECT
          e.*,
          o.business_name AS organizer_business_name,
          cu.full_name AS couple_full_name,
          cu.email AS couple_email,
          COALESCE(inv_counts.total_invites, 0) AS total_invites,
          COALESCE(wish_counts.total_wishes, 0) AS total_wishes,
          COALESCE(media_counts.total_media, 0) AS total_media
        FROM events e
        LEFT JOIN organizers o ON o.id = e.organizer_id
        LEFT JOIN users cu ON cu.id = e.couple_user_id
        LEFT JOIN (
          SELECT event_id, COUNT(*) AS total_invites FROM invitations GROUP BY event_id
        ) inv_counts ON inv_counts.event_id = e.id
        LEFT JOIN (
          SELECT event_id, COUNT(*) AS total_wishes FROM wishes GROUP BY event_id
        ) wish_counts ON wish_counts.event_id = e.id
        LEFT JOIN (
          SELECT event_id, COUNT(*) AS total_media FROM media_assets GROUP BY event_id
        ) media_counts ON media_counts.event_id = e.id
        ORDER BY e.created_at DESC
      `);
      return rows.map((r) => this.mapToDomain(r));
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      return mockStore.events.map((e) => this.mapToDomain(e));
    }
    return [];
  }

  public async findByOrganizerId(organizerId: string): Promise<Event[]> {
    try {
      const rows = await query('SELECT * FROM events WHERE organizer_id = $1 ORDER BY created_at DESC', [organizerId]);
      return rows.map((r) => this.mapToDomain(r));
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      return mockStore.events.filter((e) => (e as any).organizerId === organizerId).map((e) => this.mapToDomain(e));
    }
    return [];
  }

  public async countActiveByOrganizerId(organizerId: string): Promise<number> {
    try {
      const row = await queryOne<{ cnt: number }>(
        `SELECT COUNT(*) AS cnt FROM events WHERE organizer_id = $1 AND status NOT IN ('COMPLETED', 'ARCHIVED')`,
        [organizerId]
      );
      return Number(row?.cnt || 0);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      return mockStore.events.filter(
        (e) => ((e as any).organizerId === organizerId || (e as any).organizer_id === organizerId) && e.status !== 'COMPLETED' && e.status !== 'ARCHIVED'
      ).length;
    }
    return 0;
  }

  public async save(event: Event): Promise<Event> {
    // Save or update event
    return event;
  }

  public async updateTemplate(
    eventId: string,
    templateId: string | null,
    customizationJson: string | null,
    lockAt: string | null,
    lockBy: string | null
  ): Promise<Event> {
    try {
      await query(
        `UPDATE events SET
           template_id = COALESCE($1, template_id),
           template_customization_json = COALESCE($2, template_customization_json),
           template_locked_at = COALESCE($3, template_locked_at),
           template_locked_by = COALESCE($4, template_locked_by)
         WHERE id = $5`,
        [templateId, customizationJson, lockAt, lockBy, eventId]
      );
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    const updated = await this.findById(eventId);
    if (!updated) throw new Error(`Event '${eventId}' not found after template update.`);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await query('DELETE FROM events WHERE id = $1 OR slug = $1', [id]);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const idx = mockStore.events.findIndex((e) => e.id === id || e.slug === id);
      if (idx >= 0) mockStore.events.splice(idx, 1);
    }
    return true;
  }
}
