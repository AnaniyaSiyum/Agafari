import { IInvitationRepository } from '../../application/repositories/IInvitationRepository';
import { Invitation, InvitationProps } from '../../domain/entities/Invitation';
import { query, queryOne, withTransaction } from '../../lib/db';
import { mockStore } from '../../lib/mockData';
import { AlreadyScannedError, HeadcountExceededError } from '../../domain/errors/DomainError';

export class MySqlInvitationRepository implements IInvitationRepository {
  private isDev(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  private mapToDomain(row: any): Invitation {
    const props: InvitationProps = {
      id: row.id,
      eventId: row.event_id || row.eventId,
      inviteCode: row.invite_code || row.inviteCode,
      inviteType: row.invite_type || row.inviteType || 'LINK',
      guestName: row.guest_name || row.guestName || 'Guest',
      guestPhone: row.guest_phone || row.guestPhone || null,
      maxGuests: Number(row.max_guests || row.maxGuests || 1),
      tableNumber: row.table_number || row.tableNumber || null,
      rsvpStatus: row.rsvp_status || row.rsvpStatus || 'PENDING',
      attendingHeadcount: Number(row.attending_headcount || row.attendingHeadcount || 0),
      rsvpLockedAt: row.rsvp_locked_at || row.rsvpLockedAt || null,
      isScanned: Boolean(row.is_scanned ?? row.isScanned ?? false),
      scannedCount: Number(row.scanned_count || row.scannedCount || 0),
      scannedAt: row.scanned_at || row.scannedAt || null,
      qrCodeUrl: row.qr_code_url || row.qrCodeUrl || null,
    };
    return new Invitation(props);
  }

  public async findById(id: string): Promise<Invitation | null> {
    try {
      const row = await queryOne('SELECT * FROM invitations WHERE id = $1', [id]);
      if (row) return this.mapToDomain(row);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const found = mockStore.invitations.find((i) => i.id === id);
      if (found) return this.mapToDomain(found);
    }
    return null;
  }

  public async findByInviteCode(eventId: string, inviteCode: string): Promise<Invitation | null> {
    try {
      const row = await queryOne(
        'SELECT * FROM invitations WHERE event_id = $1 AND LOWER(invite_code) = LOWER($2)',
        [eventId, inviteCode.trim()]
      );
      if (row) return this.mapToDomain(row);
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const found = mockStore.invitations.find(
        (i) => i.eventId === eventId && i.inviteCode.toLowerCase() === inviteCode.trim().toLowerCase()
      );
      if (found) return this.mapToDomain(found);
    }
    return null;
  }

  public async findByEventId(eventId: string): Promise<Invitation[]> {
    try {
      const rows = await query('SELECT * FROM invitations WHERE event_id = $1 ORDER BY created_at DESC', [eventId]);
      return rows.map((r) => this.mapToDomain(r));
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      return mockStore.invitations.filter((i) => i.eventId === eventId).map((i) => this.mapToDomain(i));
    }
    return [];
  }

  public async save(invitation: Invitation): Promise<Invitation> {
    try {
      await query(
        `INSERT INTO invitations (id, event_id, invite_code, invite_type, guest_name, guest_phone, max_guests, table_number, qr_code_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON DUPLICATE KEY UPDATE guest_name = VALUES(guest_name), max_guests = VALUES(max_guests)`,
        [
          invitation.id,
          invitation.eventId,
          invitation.inviteCode,
          invitation.props.inviteType ?? 'LINK',
          invitation.guestName,
          invitation.props.guestPhone ?? null,
          invitation.maxGuests,
          invitation.props.tableNumber ?? null,
          invitation.props.qrCodeUrl ?? null,
        ]
      );
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const idx = mockStore.invitations.findIndex((i) => i.id === invitation.id);
      const rawData = {
        id: invitation.id,
        eventId: invitation.eventId,
        inviteCode: invitation.inviteCode,
        inviteType: invitation.props.inviteType,
        guestName: invitation.guestName,
        guestPhone: invitation.props.guestPhone || '',
        maxGuests: invitation.maxGuests,
        tableNumber: invitation.props.tableNumber || '',
        rsvpStatus: invitation.props.rsvpStatus || 'PENDING',
        scannedCount: invitation.scannedCount,
        isScanned: invitation.isScanned,
        qrCodeUrl: invitation.props.qrCodeUrl || '',
        createdAt: new Date().toISOString(),
      };
      if (idx >= 0) mockStore.invitations[idx] = rawData as any;
      else mockStore.invitations.unshift(rawData as any);
    }

    return invitation;
  }

  public async updateRsvp(invitationId: string, status: string, headcount: number): Promise<void> {
    try {
      await query(
        `UPDATE invitations SET rsvp_status = $1, attending_headcount = $2, rsvp_updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
        [status, headcount, invitationId]
      );
    } catch (err) {
      if (!this.isDev()) throw err;
    }

    if (this.isDev()) {
      const found = mockStore.invitations.find((i) => i.id === invitationId);
      if (found) {
        found.rsvpStatus = status as any;
        found.attendingHeadcount = headcount;
      }
    }
  }

  // Part B Finding 3.1 & 4.2: Atomic cumulative headcount check-in with row locking FOR UPDATE
  public async atomicCheckIn(invitationId: string, admitCount: number, staffUserId: string): Promise<{ invitation: Invitation; admitted: number }> {
    try {
      const outcome = await withTransaction(async (client) => {
        // SELECT FOR UPDATE locks row
        const row = (
          await client.query(
            `SELECT id, event_id, invite_code, guest_name, max_guests, scanned_count, is_scanned, scanned_at
             FROM invitations WHERE id = $1 FOR UPDATE`,
            [invitationId]
          )
        ).rows[0];

        if (!row) throw new Error(`Invitation '${invitationId}' not found during check-in.`);

        const domainInv = this.mapToDomain(row);
        const headcount = domainInv.getHeadcount();

        if (headcount.isFullyScanned) {
          throw new AlreadyScannedError();
        }

        const available = headcount.remainingAllowance;
        if (admitCount > domainInv.maxGuests && available === domainInv.maxGuests) {
          throw new HeadcountExceededError(domainInv.maxGuests, admitCount);
        }

        const actualAdmit = Math.min(admitCount, available);
        const newScannedCount = domainInv.scannedCount + actualAdmit;
        const isFullyScanned = newScannedCount >= domainInv.maxGuests;

        await client.query(
          `UPDATE invitations SET
             scanned_count = $1,
             is_scanned = $2,
             scanned_at = CURRENT_TIMESTAMP,
             scanned_by = $3
           WHERE id = $4`,
          [newScannedCount, isFullyScanned, staffUserId, invitationId]
        );

        domainInv.props.scannedCount = newScannedCount;
        domainInv.props.isScanned = isFullyScanned;

        return { invitation: domainInv, admitted: actualAdmit };
      });

      return outcome;
    } catch (err) {
      if (!this.isDev()) throw err;

      // In-memory fallback
      const found = mockStore.invitations.find((i) => i.id === invitationId);
      if (!found) throw new Error('Invitation not found in mock store.');
      const domainInv = this.mapToDomain(found);
      const { admittedCount, newScannedCount, isFullyScanned } = domainInv.attemptCheckIn(admitCount);
      found.scannedCount = newScannedCount;
      found.isScanned = isFullyScanned;
      return { invitation: domainInv, admitted: admittedCount };
    }
  }

  // Part B Finding 4.2: Asynchronous scan logging outside transaction
  public async logScanAsync(
    invitationId: string | null,
    staffId: string | undefined,
    result: string,
    headcountAdmitted: number,
    clientScannedAt?: string
  ): Promise<void> {
    if (!invitationId) return;
    try {
      const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await query(
        `INSERT INTO gate_scan_logs (id, invitation_id, event_staff_id, result, headcount_admitted, client_scanned_at)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [logId, invitationId, staffId ?? null, result, headcountAdmitted, clientScannedAt ?? null]
      );
    } catch (err) {
      console.warn('Scan logging warning:', err);
    }
  }
}
