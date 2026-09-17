/**
 * @deprecated Legacy shim — use `Ticket` from `@/domain/entities/Ticket` directly.
 *
 * This file previously held standalone HMAC signing functions. Those are now
 * owned by the `Ticket` domain entity (single source of truth). This shim
 * re-exports thin wrappers so any legacy callers still compile without changes.
 */
import { Ticket } from '@/domain/entities/Ticket';

const TICKET_SECRET = process.env.TICKET_SIGNING_SECRET || 'fallback-signing-secret-agafari-2026';

/** @deprecated Use Ticket.generateInviteCode() */
export const generateInviteCode = (): string => Ticket.generateInviteCode();

/** @deprecated Use Ticket.signPayload() with explicit secret */
export const signTicket = (eventId: string, inviteCode: string, maxGuests: number): string =>
  Ticket.signPayload(eventId, inviteCode, maxGuests, TICKET_SECRET);

/** @deprecated Use Ticket.verifySignature() with explicit secret */
export const verifyTicketSignature = (
  eventId: string,
  inviteCode: string,
  maxGuests: number,
  signature: string
): boolean => Ticket.verifySignature(eventId, inviteCode, maxGuests, signature, TICKET_SECRET);

/** @deprecated Use Ticket.buildQrPayload() with explicit secret */
export const buildQrPayload = (eventId: string, inviteCode: string, maxGuests: number) =>
  Ticket.buildQrPayload(eventId, inviteCode, maxGuests, TICKET_SECRET);
