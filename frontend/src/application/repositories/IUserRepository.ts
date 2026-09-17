export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  role: string;
  companyName?: string;
  organizerId?: string;
  isActive?: boolean;
}

export interface IUserRepository {
  findById(id: string): Promise<UserAccount | null>;
  findByEmail(email: string): Promise<UserAccount | null>;
  findAll(): Promise<UserAccount[]>;
  deleteOrganizerAccount(organizerUserId: string): Promise<boolean>;
}
