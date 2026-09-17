import { IUserRepository, UserAccount } from '../../application/repositories/IUserRepository';
import { query, queryOne } from '../../lib/db';
import { mockStore } from '../../lib/mockData';

export class MySqlUserRepository implements IUserRepository {
  private isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  private mapToDomain(row: any): UserAccount {
    return {
      id: row.id,
      email: row.email,
      fullName: row.full_name || row.fullName || row.email.split('@')[0],
      role: row.role,
      companyName: row.business_name || row.companyName || row.full_name,
      organizerId: row.organizer_id || row.organizerId || `org-${row.id}`,
      isActive: Boolean(row.is_active ?? true),
    };
  }

  public async findById(id: string): Promise<UserAccount | null> {
    try {
      const row = await queryOne(
        `SELECT u.*, o.id AS organizer_id, o.business_name
         FROM users u
         LEFT JOIN organizers o ON o.owner_user_id = u.id
         WHERE u.id = $1 OR o.id = $1`,
        [id]
      );
      if (row) return this.mapToDomain(row);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const found = mockStore.users.find((u) => u.id === id || (u as any).organizerId === id);
      if (found) return this.mapToDomain(found);
    }
    return null;
  }

  public async findByEmail(email: string): Promise<UserAccount | null> {
    try {
      const row = await queryOne('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
      if (row) return this.mapToDomain(row);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const found = mockStore.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) return this.mapToDomain(found);
    }
    return null;
  }

  public async findAll(): Promise<UserAccount[]> {
    try {
      const rows = await query(`
        SELECT u.id, u.email, u.full_name, u.role, u.is_active,
               o.id AS organizer_id, o.business_name
        FROM users u
        LEFT JOIN organizers o ON o.owner_user_id = u.id
        ORDER BY u.created_at DESC
      `);
      return rows.map((r) => this.mapToDomain(r));
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      return mockStore.users.map((u) => this.mapToDomain(u));
    }
    return [];
  }

  public async deleteOrganizerAccount(organizerUserId: string): Promise<boolean> {
    const rawOrgId = organizerUserId.startsWith('org-') ? organizerUserId : `org-${organizerUserId}`;
    try {
      await query('DELETE FROM organizers WHERE owner_user_id = $1 OR id = $1 OR id = $2', [organizerUserId, rawOrgId]);
      await query('DELETE FROM users WHERE id = $1', [organizerUserId]);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const idx = mockStore.users.findIndex((u) => u.id === organizerUserId || u.id === rawOrgId || (u as any).organizerId === organizerUserId);
      if (idx >= 0) mockStore.users.splice(idx, 1);
    }
    return true;
  }
}
