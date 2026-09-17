import { createHmac, randomBytes } from 'crypto';
import { InvalidQrSignatureError } from '../errors/DomainError';

export interface QrPayload {
  eventId: string;
  inviteCode: string;
  maxGuests: number;
  sig: string;
}

export class Ticket {
  public static generateInviteCode(): string {
    return randomBytes(9).toString('base64url'); // 12 URL-safe chars
  }

  public static signPayload(eventId: string, inviteCode: string, maxGuests: number, secret: string): string {
    const payloadStr = `${eventId}|${inviteCode}|${maxGuests}`;
    return createHmac('sha256', secret).update(payloadStr).digest('base64url');
  }

  public static verifySignature(
    eventId: string,
    inviteCode: string,
    maxGuests: number,
    signature: string,
    secret: string
  ): boolean {
    const expected = Ticket.signPayload(eventId, inviteCode, maxGuests, secret);
    return expected.length === signature.length && expected === signature;
  }

  public static buildQrPayload(eventId: string, inviteCode: string, maxGuests: number, secret: string): QrPayload {
    return {
      eventId,
      inviteCode,
      maxGuests,
      sig: Ticket.signPayload(eventId, inviteCode, maxGuests, secret),
    };
  }

  public static validateOrThrow(eventId: string, inviteCode: string, maxGuests: number, signature: string, secret: string): void {
    if (!Ticket.verifySignature(eventId, inviteCode, maxGuests, signature, secret)) {
      throw new InvalidQrSignatureError();
    }
  }
}
