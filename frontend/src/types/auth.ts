/**
 * Agafari Admin-Controlled Authentication Types
 */

export type AppRole =
  | 'SYSTEM_ADMIN'
  | 'ORGANIZER_OWNER'
  | 'COUPLE'
  | 'GATE_SCANNER'
  | 'MEDIA_MODERATOR';

export type ScopeType = 'PLATFORM' | 'ORGANIZER' | 'EVENT';

export type UserStatus = 'PENDING' | 'ACTIVE' | 'DISABLED';

export type AccountRequestStatus = 'OPEN' | 'DONE' | 'REJECTED';

export interface UserAccount {
  id: string;
  email: string;
  phone?: string | null;
  passwordHash?: string | null;
  passwordSetBy?: string | null;
  passwordSetAt?: string | null;
  status: UserStatus;
  totpSecret?: string | null;
  totpEnabled: boolean;
  sessionVersion: number;
  fullName?: string;
  createdAt?: string;
}

export interface UserMembership {
  id: string;
  userId: string;
  role: AppRole;
  scopeType: ScopeType;
  scopeId: string;
  status: 'ACTIVE' | 'DISABLED';
  expiresAt?: string | null;
  createdAt?: string;
}

export interface AccountRequest {
  id: string;
  requestedBy: string;
  role: 'COUPLE' | 'GATE_SCANNER' | 'MEDIA_MODERATOR';
  scopeId: string; // Event ID
  detailsJson: {
    fullName: string;
    email: string;
    phone?: string;
    notes?: string;
  };
  status: AccountRequestStatus;
  handledBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  actorId?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  ip?: string | null;
  metaJson?: Record<string, any> | null;
  createdAt: string;
}

export interface AuthSessionPayload {
  userId: string;
  email: string;
  membershipId: string;
  role: AppRole;
  scopeType: ScopeType;
  scopeId: string;
  sessionVersion: number;
  isViewAs?: boolean;
  viewAsOriginalAdminId?: string;
}
